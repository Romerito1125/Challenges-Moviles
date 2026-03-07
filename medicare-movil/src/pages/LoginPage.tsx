import {
    IonPage,
    IonContent,
    IonInput,
    IonButton,
    IonToast,
    IonLoading,
    IonInputPasswordToggle
} from "@ionic/react";

import { useState } from "react";
import { useHistory } from "react-router";

function LoginPage() {

    const history = useHistory();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const usuarios = [
        {
            email: "JuanZuluaga@medicare.com",
            password: "1234"
        }
    ];

    function login() {

        setLoading(true);

        setTimeout(() => {

            const user = usuarios.find(
                u => u.email === email && u.password === password
            );

            setLoading(false);

            if (user) {
                history.push("/tabs/visitas");
            } else {
                setError(true);
            }

        }, 1500);

    }

    return (
        <IonPage>

            <IonContent className="ion-padding">

                <IonInput
                    type="email"
                    placeholder="Email"
                    value={email}
                    onIonChange={(e: any) => setEmail(e.detail.value)}
                />


                <IonInput
                    type="password"
                    placeholder="Password"
                    value={password}
                    onIonChange={(e: any) => setPassword(e.detail.value)}
                >
                    <IonInputPasswordToggle slot="end" />
                </IonInput>


                <IonButton expand="block" onClick={login}>
                    Iniciar sesión
                </IonButton>

                <IonToast
                    isOpen={error}
                    message="Credenciales incorrectas"
                    duration={2000}
                    onDidDismiss={() => setError(false)}
                />

                <IonLoading
                    isOpen={loading}
                    message="Verificando..."
                />

            </IonContent>

        </IonPage>
    );
}

export default LoginPage;
