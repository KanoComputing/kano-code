(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    Kano.MakeApps.Msg = Kano.MakeApps.Msg || {};

    Kano.MakeApps.Msg['add-parts-1'] = "Comenzaremos por agregarle partes a nuestra aplicación.";
    Kano.MakeApps.Msg['add-parts-2'] = "Para crear la interfaz de la aplicación, necesitamos partes";

    Kano.MakeApps.Msg['open-parts-drawer-1'] = "Haz click aquí para ver todas las partes.";
    Kano.MakeApps.Msg['open-parts-drawer-2'] = "Abre las partes que nos permiten dibujar haciendo click aquí.";

    Kano.MakeApps.Msg['start-code-1'] = "Ahora podemos empezar a programar.";
    Kano.MakeApps.Msg['start-code-2'] = "Todas las partes están aquí, ¡vamos a programar!";

    Kano.MakeApps.Msg['close-parts-drawer-1'] = "Cierra la bandeja de dibujo.";
    Kano.MakeApps.Msg['close-parts-drawer-2'] = "Pulsa este botón";

    Kano.MakeApps.Msg['connect-blocks-1'] = "Conéctalo a este bloque";

    Kano.MakeApps.Msg['drop-codespace-1'] = "Suelta el bloque en cualquier sitio del área de trabajo";


    Kano.MakeApps.Msg['wrong-block-added-1'] = "¡Oh no! Este no es el bloque correcto.";

    Kano.MakeApps.Msg['put-block-in-bin-1'] = "Está bien, colócalo en el cesto de basura";

    Kano.MakeApps.Msg['wrong-category-opened-1'] = "No, abre ésta mejor";
    Kano.MakeApps.Msg['wrong-block-connection-1'] = "Whoops, not quite right. Put it there instead";


    Kano.MakeApps.Msg.Groups = Kano.MakeApps.Msg.Groups || {};

    Kano.MakeApps.Msg.Groups['add-parts'] = ['add-parts-1', 'add-parts-2'];
    Kano.MakeApps.Msg.Groups['open-parts-drawer'] = ['open-parts-drawer-1', 'open-parts-drawer-2'];
    Kano.MakeApps.Msg.Groups['start-code'] = ['start-code-1', 'start-code-2'];
    Kano.MakeApps.Msg.Groups['close-parts-drawer'] = ['close-parts-drawer-1', 'close-parts-drawer-2'];
    Kano.MakeApps.Msg.Groups['connect-blocks'] = ['connect-blocks-1'];
    Kano.MakeApps.Msg.Groups['drop-codespace'] = ['drop-codespace-1'];
    Kano.MakeApps.Msg.Groups['wrong-block-added'] = ['wrong-block-added-1'];
    Kano.MakeApps.Msg.Groups['put-block-in-bin'] = ['put-block-in-bin-1'];
    Kano.MakeApps.Msg.Groups['wrong-category-opened'] = ['wrong-category-opened-1'];
    Kano.MakeApps.Msg.Groups['wrong-block-connection'] = ['wrong-block-connection-1'];


    Kano.MakeApps.Msg.CLOSE = "Cerrar";

    Kano.MakeApps.Msg.STROKE_SIZE = "Tamaño del trazo";
    Kano.MakeApps.Msg.STROKE_COLOR = "Color del trazo";
    Kano.MakeApps.Msg.WIDTH = "Anchura";
    Kano.MakeApps.Msg.HEIGHT = "Altura";
    Kano.MakeApps.Msg.RADIUS = "Radio";
    Kano.MakeApps.Msg.COLOR = "Color";
    Kano.MakeApps.Msg.LABEL = "Etiqueta";
    Kano.MakeApps.Msg.WAVE = "Onda";
    Kano.MakeApps.Msg.SPEED = "Velocidad";
    Kano.MakeApps.Msg.DELAY = "Retraso";
    Kano.MakeApps.Msg.MIN = "Mín.";
    Kano.MakeApps.Msg.MAX = "Máx.";
    Kano.MakeApps.Msg.IMAGE = "Imagen";
    Kano.MakeApps.Msg.ANIMATION = "Animación";
    Kano.MakeApps.Msg.ANIMATIONS = "Animaciones";
    Kano.MakeApps.Msg.BITMAP = "Bitmap";
    Kano.MakeApps.Msg.BITMAPS = "Bitmaps";
    Kano.MakeApps.Msg.SIZE = "Tamaño";
    Kano.MakeApps.Msg.TEXT = "Texto";
    Kano.MakeApps.Msg.PLACEHOLDER = "Marcador de posición";
    Kano.MakeApps.Msg.SCROLL_DEFAULT = "Mi texto de desplazamiento";
    Kano.MakeApps.Msg.TEXT_DEFAULT = "Mi texto";

    Kano.MakeApps.Msg.IS_CLICKED = "está clickeado";
    Kano.MakeApps.Msg.CHANGED = "cambiado";
    Kano.MakeApps.Msg.CLICK_ME = "Hazme click";

    Kano.MakeApps.Msg.PART_BOX_NAME = "Caja";
    Kano.MakeApps.Msg.PART_BUTTON_NAME = "Botón";
    Kano.MakeApps.Msg.PART_CLOCK_NAME = "Reloj";
    Kano.MakeApps.Msg.PART_MAP_NAME = "Mapa";
    Kano.MakeApps.Msg.PART_MIC_NAME = "Mic";
    Kano.MakeApps.Msg.PART_OSC_NAME = "Osc";
    Kano.MakeApps.Msg.PART_PICTURE_LIST_NAME = "Lista de imágenes";
    Kano.MakeApps.Msg.PART_SCROLL_NAME = "Scroller";
    Kano.MakeApps.Msg.PART_SLIDER_NAME = "Slider";
    Kano.MakeApps.Msg.PART_SPEAKER_NAME = "Speaker";
    Kano.MakeApps.Msg.PART_STICKER_NAME = "Sticker";
    Kano.MakeApps.Msg.PART_TEXT_NAME = "Texto";
    Kano.MakeApps.Msg.PART_TEXT_INPUT_NAME = "Texto de entrada";
    Kano.MakeApps.Msg.PART_CANVAS_NAME = "Dibujar";
    Kano.MakeApps.Msg.PART_DATA_SHARE_NAME = "Compartidos";
    Kano.MakeApps.Msg.PART_DATA_ISS_NAME = "ISS";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_NAME = "Clima";
    Kano.MakeApps.Msg.PART_DATA_RSS_NAME = "RSS";
    Kano.MakeApps.Msg.PART_DATA_SPORTS_NAME = "Deportes";
    Kano.MakeApps.Msg.PART_LIGHT_ANIMATION_NAME = "Animación";
    Kano.MakeApps.Msg.PART_LIGHT_ANIMATION_DISPLAY_NAME = "Jugador";
    Kano.MakeApps.Msg.PART_LIGHT_CIRCLE_NAME = "Círculo";
    Kano.MakeApps.Msg.PART_LIGHT_FRAME_NAME = "Marco";
    Kano.MakeApps.Msg.PART_LIGHT_RECTANGLE_NAME = "Rectángulo";
    Kano.MakeApps.Msg.PART_FIREWORKS_NAME = "Fuegos artificiales";
    Kano.MakeApps.Msg.PART_TALKING_FACE_NAME = "Cara Parlante";
    Kano.MakeApps.Msg.PART_GESTURE_SENSOR_NAME = "Sensor de Gestos";
    Kano.MakeApps.Msg.PART_GYRO_ACCELEROMETER_NAME = "Inclinación";
    Kano.MakeApps.Msg.PART_MOTION_SENSOR_NAME = "Tripwire";
    Kano.MakeApps.Msg.PART_PROXIMITY_SENSOR_NAME = "Sensor de Proximidad";

    Kano.MakeApps.Msg.BLOCK_TEXT_INPUT_TYPE_IN = "Escribe aquí...";

    Kano.MakeApps.Msg.PART_DATA_SHARE_TITLE_TITLE = "Título";
    Kano.MakeApps.Msg.PART_DATA_SHARE_TITLE_DESC = "Título de lo que compartirás";
    Kano.MakeApps.Msg.PART_DATA_SHARE_LIKES_TITLE = "Likes";
    Kano.MakeApps.Msg.PART_DATA_SHARE_LIKES_DESC = "Cuántos likes tuvo lo compartido";
    Kano.MakeApps.Msg.PART_DATA_SHARE_USER_TITLE = "Usuario";
    Kano.MakeApps.Msg.PART_DATA_SHARE_USER_DESC = "Nombre del autor de lo compartido";
    Kano.MakeApps.Msg.PART_DATA_SHARE_IMAGE_TITLE = "Imagen";
    Kano.MakeApps.Msg.PART_DATA_SHARE_IMAGE_DESC = "Imagen de lo compartido";

    Kano.MakeApps.Msg.PART_DATA_ISS_LATITUDE_TITLE = "Latitud";
    Kano.MakeApps.Msg.PART_DATA_ISS_LATITUDE_DESC = "Latitude of the ISS";
    Kano.MakeApps.Msg.PART_DATA_ISS_LONGITUDE_TITLE = "Longitud";
    Kano.MakeApps.Msg.PART_DATA_ISS_LONGITUDE_DESC = "Longitude of the ISS";

    Kano.MakeApps.Msg.PART_DATA_WEATHER_LOCATION_TITLE = "Ubicación";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_LOCATION_DEFAULT = "London, U.K.";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_UNITS_TITLE = "Units";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_UNITS_DESC = "El sistema métrico mostrará la temperatura en ÂºC mientras que el imperial la mostrará en ÂºF";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_UNITS_METRIC = "Sistema Métrico";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_UNITS_IMPERIAL = "Sistema Imperial";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_TEMPERATURE_TITLE = "Temperatura";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_TEMPERATURE_DESC = "La temperatura actual en la ubicación";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_SPEED_TITLE = "Velocidad del viento";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_SPEED_DESC = "La velocidad del viento";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_ANGLE_TITLE = "Ángulo del viento";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_ANGLE_DESC = "La dirección general del viento";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_CLOUDS_TITLE = "Nubes";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_CLOUDS_DESC = "Porcentaje del cielo cubierto por nubes";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_EMOJI_TITLE = "Emoji";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_EMOJI_DESC = "El emoji a tono con el clima";

    Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_TITLE = "Fuente";
    Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_HEADLINES = "Titulares";
    Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_WORLD = "Mundo";
    Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_UK = "UK";
    Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_EDUCATION = "Educación";
    Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_SCI_ENV = "Ciencia y Medio ambiente";
    Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_TECH = "Tecnología";
    Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_ENT_ARTS = "Arte y Entretenimiento";

    Kano.MakeApps.Msg.PART_DATA_RSS_TITLE_TITLE = "Título";
    Kano.MakeApps.Msg.PART_DATA_RSS_TITLE_DESC = "Título del artículo";

    Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_TITLE = "Deportes";
    Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_HEADLINES = "Titulares";
    Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_FOOTBALL = "Fútbol";
    Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_CRICKET = "Críquet";
    Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_RUGBY_UNION = "Unión de Rugby";
    Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_RUGBY_LEAGUE = "Liga de Rugby";
    Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_TENNIS = "Tennis";
    Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_GOLF = "Golf";

    Kano.MakeApps.Msg.PART_GESTURE_SENSOR_UP = "gesto hacia arriba";
    Kano.MakeApps.Msg.PART_GESTURE_SENSOR_DOWN = "gesto hacia abajo";
    Kano.MakeApps.Msg.PART_GESTURE_SENSOR_LEFT = "gesto hacia la izquierda";
    Kano.MakeApps.Msg.PART_GESTURE_SENSOR_RIGHT = "gesture right";
    Kano.MakeApps.Msg.PART_GESTURE_SENSOR_NEAR = "gesture near";
    Kano.MakeApps.Msg.PART_GESTURE_SENSOR_FAR = "gesture far";

    Kano.MakeApps.Msg.PART_GYRO_ACCELEROMETER_READ_DATA = "reads data";

    Kano.MakeApps.Msg.PART_MOTION_SENSOR_START = "comienza el movimiento";
    Kano.MakeApps.Msg.PART_MOTION_SENSOR_END = "finaliza el movimiento";

    Kano.MakeApps.Msg.KANO_WORKSPACE_HEAD_SAVE = "Guardar";

    Kano.MakeApps.Msg.KANO_WORKSPACE_TOOLBAR_CLOSE = "cerrar";
    Kano.MakeApps.Msg.KANO_WORKSPACE_TOOLBAR_ADD_PARTS = "agregar partes";
    Kano.MakeApps.Msg.KANO_WORKSPACE_TOOLBAR_DONE = "Hecho";
    Kano.MakeApps.Msg.KANO_WORKSPACE_TOOLBAR_EDIT_LAYOUT = "Editar diseño";

    Kano.MakeApps.Msg.KANO_SIDE_MENU_LOGIN = "Ingresar";
    Kano.MakeApps.Msg.KANO_SIDE_MENU_LEVEL = "Nivel";
    Kano.MakeApps.Msg.KANO_SIDE_MENU_RESET_WORKSPACE = "Reiniciar el espacio de trabajo";
    Kano.MakeApps.Msg.KANO_SIDE_MENU_EXPORT = "Exportar";
    Kano.MakeApps.Msg.KANO_SIDE_MENU_IMPORT = "Importar";
    Kano.MakeApps.Msg.KANO_SIDE_MENU_BACK_TO_PROJECTS = "Volver a los proyectos";
    Kano.MakeApps.Msg.KANO_SIDE_MENU_GIVE_FEEDBACK = "Dar opinión";
    Kano.MakeApps.Msg.KANO_SIDE_MENU_EXIT = "Salir";
    Kano.MakeApps.Msg.KANO_SIDE_MENU_LOG_OUT = "Cerrar sesión";

    Kano.MakeApps.Msg.KANO_SHARE_MODAL_RECORDING = "Grabando tu gif";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_BEGIN_RECORDING = "Haz click para comenzar a grabar tu gif";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_START_RECORDING = "Comienza a grabar tu gif animado";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_CLOSE = Kano.MakeApps.Msg.CLOSE;
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_MAKE_GIF = "Crea un gif";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_SHARE_ON_WORLD = "Compartir en Kano World";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_COPY = "copiar";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_GET_SHARE_LINK = "Obtener el link de lo compartido";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_BRING_TO_LIFE = "Saca a la luz tu propia creación";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_BUILD_YOUR_OWN = "build your own";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_PUBLISHING = "Publicando";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_APP_IS_LIVE = "¡Tu aplicación tiene vida! Compártela con tus amigos.";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_OPEN_APP = "Abrir aplicación";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_PUBLISHING_FAILED = "Publicación ha fracasado";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_TRY_LATER = "Por favor intenta más tarde.";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_UNFORTUNATE = "This is unfortunate";

    Kano.MakeApps.Msg.KANO_CHALLENGE_COMPLETED_MODAL_CHALLENGE_COMPLETED = "Has Completado el Desafío";
    Kano.MakeApps.Msg.KANO_CHALLENGE_COMPLETED_MODAL_XP_EARNED = "Ahora has ganado";
    Kano.MakeApps.Msg.KANO_CHALLENGE_COMPLETED_MODAL_XP = "PX";
    Kano.MakeApps.Msg.KANO_CHALLENGE_COMPLETED_MODAL_GOT_IT = "CONTINUAR";
    Kano.MakeApps.Msg.KANO_CHALLENGE_COMPLETED_MODAL_COMPLIMENT = "¡Buen trabajo!";

    Kano.MakeApps.Msg.KANO_CHALLENGE_UI_NEXT = "Siguiente";
    Kano.MakeApps.Msg.KANO_CHALLENGE_UI_HINT = "Indicio";

})(window.Kano = window.Kano || {});
