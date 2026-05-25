/**
 * SetPassword
 * -----------
 * Pantalla que se muestra cuando un empleado recién invitado hace clic
 * en el link del email. Supabase inyecta el token en la URL como hash:
 *   http://localhost:8100/set-password#access_token=...&type=invite
 *
 * El SDK de Supabase detecta ese hash automáticamente y establece la sesión.
 * Solo hay que pedirle al usuario que elija su contraseña y llamar a
 * supabase.auth.updateUser({ password }).
 *
 * Deep link en móvil:
 *   com.tuapp://set-password#access_token=...&type=invite
 *   (configurar en capacitor.config.ts + AndroidManifest / Info.plist)
 */

import {
  IonPage,
  IonContent,
  IonInput,
  IonItem,
  IonSpinner,
  IonIcon,
} from '@ionic/react';
import { lockClosedOutline, checkmarkCircleOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../supabase/client';

type Step = 'loading' | 'form' | 'success' | 'error';

export default function SetPassword() {
  const history = useHistory();

  const [step, setStep]           = useState<Step>('loading');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg]   = useState<string | null>(null);
  const [nombre, setNombre]       = useState<string>('');

  const sessionReady = useRef(false);

  useEffect(() => {
    /**
     * Supabase procesa el hash de la URL automáticamente al inicializar.
     * Escuchamos el evento PASSWORD_RECOVERY o SIGNED_IN con type=invite
     * para confirmar que el token es válido antes de mostrar el formulario.
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') {
        sessionReady.current = true;
        const meta = session?.user?.user_metadata;
        setNombre(meta?.nombre ?? '');
        setStep('form');
      }
    });

    // Si ya hay sesión activa (recarga de página), mostrar el form directamente
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        sessionReady.current = true;
        const meta = data.session.user?.user_metadata;
        setNombre(meta?.nombre ?? '');
        setStep('form');
      } else {
        // Sin sesión y sin hash → esperar al listener; si no llega en 4s, es token inválido
        setTimeout(() => {
          if (!sessionReady.current) setStep('error');
        }, 4000);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const validar = (): string | null => {
    if (password.length < 8)
      return 'La contraseña debe tener al menos 8 caracteres';
    if (password !== confirm)
      return 'Las contraseñas no coinciden';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validar();
    if (err) { setErrorMsg(err); return; }

    setIsPending(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setStep('success');
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Error al establecer la contraseña');
    } finally {
      setIsPending(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (step === 'loading') {
    return (
      <IonPage>
        <IonContent style={{ '--background': '#020617' }}>
          <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#020617] to-black flex flex-col items-center justify-center gap-4 text-white">
            <IonSpinner name="crescent" className="text-blue-400 w-10 h-10" />
            <p className="text-gray-400">Verificando invitación...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // ── Error / token inválido ───────────────────────────────────────────────
  if (step === 'error') {
    return (
      <IonPage>
        <IonContent style={{ '--background': '#020617' }}>
          <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#020617] to-black flex flex-col items-center justify-center gap-4 text-white px-8">
            <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-center">Link inválido o expirado</h2>
            <p className="text-gray-400 text-sm text-center">
              El link de invitación ya fue usado o expiró. Pide al administrador que te reenvíe la invitación.
            </p>
            <button
              onClick={() => history.replace('/login')}
              className="px-6 py-3 bg-blue-600 rounded-xl text-white font-medium"
            >
              Ir al login
            </button>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // ── Éxito ────────────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <IonPage>
        <IonContent style={{ '--background': '#020617' }}>
          <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#020617] to-black flex flex-col items-center justify-center gap-5 text-white px-8">
            <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
              <IonIcon icon={checkmarkCircleOutline} className="text-green-400 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-center">¡Contraseña establecida!</h2>
            <p className="text-gray-400 text-sm text-center">
              Tu cuenta está lista. Ya puedes iniciar sesión con tu email y la contraseña que acabas de crear.
            </p>
            <button
              onClick={() => history.replace('/login')}
              className="w-full max-w-xs px-6 py-4 bg-linear-to-r from-blue-600 to-blue-500 rounded-2xl text-white font-bold text-lg shadow-lg shadow-blue-900/40 active:scale-95 transition-all"
            >
              Ir al login
            </button>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // ── Formulario ───────────────────────────────────────────────────────────
  return (
    <IonPage>
      <IonContent style={{ '--background': '#020617' }}>
        <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#020617] to-black text-white flex flex-col px-6 py-12 gap-8">

          {/* Encabezado */}
          <div className="flex flex-col items-center gap-3 pt-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <IonIcon icon={lockClosedOutline} className="text-blue-400 text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-center">
              {nombre ? `Hola, ${nombre}` : 'Bienvenido'}
            </h1>
            <p className="text-gray-400 text-sm text-center">
              Elige una contraseña para activar tu cuenta
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Contraseña */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <IonItem lines="none" style={{ '--background': 'transparent', '--color': '#f1f5f9' }}>
                <div className="flex items-center gap-3 w-full py-1">
                  <IonIcon icon={lockClosedOutline} className="text-gray-400 text-lg" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-xs mb-1">Nueva contraseña</p>
                    <IonInput
                      type={showPwd ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onIonInput={(e) => setPassword(e.detail.value!)}
                      required
                      style={{ '--color': '#f1f5f9', '--placeholder-color': '#64748b' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="text-gray-400 p-1"
                  >
                    <IonIcon icon={showPwd ? eyeOffOutline : eyeOutline} className="text-xl" />
                  </button>
                </div>
              </IonItem>
            </div>

            {/* Confirmar contraseña */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <IonItem lines="none" style={{ '--background': 'transparent', '--color': '#f1f5f9' }}>
                <div className="flex items-center gap-3 w-full py-1">
                  <IonIcon icon={lockClosedOutline} className="text-gray-400 text-lg" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-xs mb-1">Confirmar contraseña</p>
                    <IonInput
                      type={showPwd ? 'text' : 'password'}
                      placeholder="Repite la contraseña"
                      value={confirm}
                      onIonInput={(e) => setConfirm(e.detail.value!)}
                      required
                      style={{ '--color': '#f1f5f9', '--placeholder-color': '#64748b' }}
                    />
                  </div>
                </div>
              </IonItem>
            </div>

            {/* Indicador de fortaleza */}
            {password.length > 0 && (
              <div className="flex gap-1 px-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      password.length >= level * 3
                        ? level <= 1 ? 'bg-red-500'
                          : level <= 2 ? 'bg-yellow-500'
                          : level <= 3 ? 'bg-blue-500'
                          : 'bg-green-500'
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{errorMsg}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || password.length < 8}
              className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-linear-to-r from-blue-600 to-blue-500 rounded-2xl text-white font-bold text-lg shadow-lg shadow-blue-900/40 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              {isPending ? (
                <IonSpinner name="crescent" className="text-white" />
              ) : (
                <>
                  <IonIcon icon={checkmarkCircleOutline} className="text-xl" />
                  Activar mi cuenta
                </>
              )}
            </button>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
}
