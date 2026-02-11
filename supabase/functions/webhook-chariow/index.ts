import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // 1. Récupérer les données envoyées par Chariow (Pulse)
        const payload = await req.json();
        console.log("🔔 Webhook Chariow reçu:", JSON.stringify(payload));

        // 2. Extraire les infos du payload
        // Adapte les clés selon la structure réelle du Pulse Chariow
        const email =
            payload.customer_email || payload.email || payload.buyer_email;
        const orderId =
            payload.order_id || payload.id || payload.transaction_id;
        const amount = payload.amount || payload.total || payload.price;
        const couponCode =
            payload.coupon_code || payload.discount_code || payload.coupon || null;
        const productName = payload.product_name || payload.product || null;

        if (!email) {
            console.error("❌ Email manquant dans le payload webhook");
            return new Response(
                JSON.stringify({ error: "Email manquant dans le payload" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();
        console.log(`📧 Traitement du paiement pour: ${normalizedEmail}`);

        // 3. Connexion Supabase avec la clé Service Role (accès admin)
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        // 4. Trouver l'utilisateur par email dans auth.users
        let userId: string | null = null;

        // Utiliser listUsers pour trouver par email
        // Note: pour un grand nombre d'utilisateurs, utiliser une requête plus ciblée
        const { data: authData, error: authError } =
            await supabase.auth.admin.listUsers();

        if (!authError && authData?.users) {
            const matchedUser = authData.users.find(
                (u: any) => u.email?.toLowerCase() === normalizedEmail
            );
            if (matchedUser) {
                userId = matchedUser.id;
                console.log(`✅ Utilisateur trouvé: ${userId}`);
            }
        } else {
            console.warn("⚠️ Erreur listUsers:", authError?.message);
        }

        // 5. Mettre à jour is_premium dans les user_metadata (auth.users)
        if (userId) {
            const { error: updateError } =
                await supabase.auth.admin.updateUserById(userId, {
                    user_metadata: {
                        is_premium: true,
                        payment_date: new Date().toISOString(),
                    },
                });

            if (updateError) {
                console.error(
                    "❌ Erreur mise à jour metadata premium:",
                    updateError.message
                );
            } else {
                console.log("✅ Statut premium activé dans auth.users metadata");
            }
        } else {
            console.warn(
                `⚠️ Aucun utilisateur trouvé pour: ${normalizedEmail}`
            );
            console.log(
                "📝 Transaction enregistrée sans user_id (rattachement ultérieur possible)"
            );
        }

        // 6. Logger la transaction dans la table transactions
        const { error: insertError } = await supabase.from("transactions").insert({
            user_id: userId,
            email: normalizedEmail,
            order_id: orderId?.toString() || null,
            amount: parseFloat(amount) || null,
            coupon_code: couponCode,
            product_name: productName,
            status: "completed",
        });

        if (insertError) {
            console.error("❌ Erreur insertion transaction:", insertError.message);
        } else {
            console.log("✅ Transaction enregistrée avec succès");
        }

        console.log(
            `🎉 Paiement traité pour: ${normalizedEmail} (coupon: ${couponCode || "aucun"})`
        );

        return new Response(
            JSON.stringify({
                success: true,
                message: `Paiement traité pour ${normalizedEmail}`,
                user_found: !!userId,
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("❌ Erreur webhook:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
