import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const payload = await req.json();
        console.log("🔔 Payload reçu:", JSON.stringify(payload));

        const email = payload.customer_email || payload.email || payload.buyer_email || payload.customer?.email;
        const orderId = payload.order_id || payload.id || payload.ref || "SIMUL-" + Date.now();
        const amount = payload.amount || payload.total || payload.price || 0;
        const couponCode = payload.coupon_code || payload.discount_code || payload.coupon || null;

        if (!email) {
            return new Response(JSON.stringify({ error: "Email manquant" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Initialisation client avec Service Role
        const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

        if (!supabaseUrl || !supabaseKey) {
            console.error("❌ Variables d'environnement manquantes");
            throw new Error("Missing environment variables");
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Chercher l'utilisateur
        console.log(`🔍 Recherche de l'utilisateur: ${normalizedEmail}`);
        const { data: userData } = await supabase.auth.admin.getUserByEmail(normalizedEmail);

        if (userData && userData.user) {
            console.log(`✅ Utilisateur trouvé: ${userData.user.id}`);

            // 2. Mettre à jour Premium
            await supabase.auth.admin.updateUserById(userData.user.id, {
                user_metadata: { is_premium: true, payment_date: new Date().toISOString() }
            });
            console.log("💎 Statut Premium activé");
        }

        // 3. Logger dans la table transactions (entouré d'un try pour ne pas bloquer le reste)
        try {
            await supabase.from("transactions").insert({
                user_id: userData?.user?.id || null,
                email: normalizedEmail,
                order_id: orderId.toString(),
                amount: parseFloat(amount),
                coupon_code: couponCode,
                status: "completed"
            });
            console.log("📝 Transaction enregistrée");
        } catch (e) {
            console.warn("⚠️ Impossible d'enregistrer dans la table 'transactions'. Vérifiez qu'elle existe.");
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("❌ Erreur:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
});
