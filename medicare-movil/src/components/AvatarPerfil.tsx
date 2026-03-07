import {
  IonAvatar,
  IonImg,
  IonItem,
  IonLabel,
} from "@ionic/react";

function Avatar({ usuario }: any) {

  const iniciales =
    usuario.nombre[0] + usuario.apellido[0];

  return usuario.imagen ? (

    <IonAvatar>
      <IonImg src={usuario.imagen} />
    </IonAvatar>

  ) : (

    <IonItem>
        <IonAvatar slot="start">
          <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
        </IonAvatar>
        <IonLabel>{iniciales}</IonLabel>
      </IonItem>

  );
}

export default Avatar;
