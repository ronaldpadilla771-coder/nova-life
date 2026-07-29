"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Moon, LogOut, Mail } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

export default function ConfiguracionPage() {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");

      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setProfile(data);
        setFullName(data.full_name ?? "");
        setAvatarUrl(data.avatar_url ?? "");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    await supabase
      .from("profiles")
      .update({ full_name: fullName, avatar_url: avatarUrl || null, updated_at: new Date().toISOString() })
      .eq("id", profile.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div>
      <Topbar title="Configuración" />
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4 text-brand-blue" />
              Perfil
            </CardTitle>
          </CardHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-brand text-xl font-semibold text-white">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  fullName?.[0]?.toUpperCase() || "N"
                )}
              </div>
              <div className="flex-1">
                <label className="label-field">URL de foto de perfil</label>
                <Input placeholder="https://..." value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="label-field">Nombre</label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>

            <div>
              <label className="label-field flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Correo electrónico
              </label>
              <Input value={email} disabled />
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleSave}>Guardar cambios</Button>
              {saved && <span className="text-xs text-brand-green">Guardado ✓</span>}
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-brand-purple" />
                Apariencia
              </CardTitle>
            </CardHeader>
            <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <div>
                <p className="text-sm font-medium">Modo oscuro</p>
                <p className="text-xs text-muted">Nova Life usa modo oscuro de forma predeterminada.</p>
              </div>
              <span className="rounded-full bg-brand-purple/20 px-3 py-1 text-xs font-medium text-brand-purple">
                Activado
              </span>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cuenta</CardTitle>
            </CardHeader>
            <Button variant="danger" onClick={handleLogout} className="w-full">
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
