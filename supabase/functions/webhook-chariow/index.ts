// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
        const payload = await req.json().catch(() => ({}));
        console.log("🔔 Payload reçu:", JSON.stringify(payload));

        const email = payload.customer_email || payload.email || payload.buyer_email || payload.customer?.email;
        if (!email) throw new Error("Email manquant dans le payload");

        const normalizedEmail = email.toLowerCase().trim();

        // RÉCUPÉRATION DES SECRETS
        const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://fvjaeetgbgggghymskgv.supabase.co";
        const supabaseKey = Deno.env.get("CHARIOW_SERVICE_ROLE") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

        if (!supabaseUrl || !supabaseKey) {
            throw new Error(`Variables d'env manquantes: URL=${!!supabaseUrl}, KEY=${!!supabaseKey}`);
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Chercher l'utilisateur avec listUsers (Méthode la plus stable)
        console.log(`🔍 Recherche utilisateur pour: ${normalizedEmail}`);
        const { data, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) throw new Error("Erreur listUsers: " + listError.message);

        const targetUser = data.users.find((u: { email?: string }) => u.email?.toLowerCase() === normalizedEmail);

        if (targetUser) {
            console.log(`✅ Utilisateur trouvé: ${targetUser.id}`);

            // 2. Mise à jour Premium
            const { error: updateError } = await supabase.auth.admin.updateUserById(targetUser.id, {
                user_metadata: {
                    is_premium: true,
                    payment_date: new Date().toISOString(),
                    source: "Chariow Webhook"
                }
            });

            if (updateError) throw new Error("Erreur update: " + updateError.message);
            console.log("💎 Statut Premium activé avec succès");
        } else {
            console.warn("⚠️ Aucun utilisateur trouvé pour cet email dans Auth");
        }

        // 3. Logger la transaction (Facultatif, ne bloque pas si échec)
        try {
            await supabase.from("transactions").insert({
                user_id: targetUser?.id || null,
                email: normalizedEmail,
                order_id: (payload.order_id || payload.id || "manual").toString(),
                amount: parseFloat(payload.amount || payload.total || 0),
                status: "completed"
            });
        } catch (e: any) {
            console.error("DB Log Error (ignored):", e.message || e);
        }

        return new Response(JSON.stringify({ success: true, user_found: !!targetUser }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

    } catch (error: any) {
        console.error("❌ Erreur:", error.message || error);
        return new Response(JSON.stringify({ error: true, message: error.message || String(error) }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
});
