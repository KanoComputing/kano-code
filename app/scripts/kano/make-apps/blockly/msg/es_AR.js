(function (Blockly) {
    Blockly.Msg = Blockly.Msg || {};

    Blockly.Msg.CATEGORY_COLOR = "Color";
    Blockly.Msg.CATEGORY_CONTROL = "Control";
    Blockly.Msg.CATEGORY_EVENTS = "Eventos";
    Blockly.Msg.CATEGORY_LISTS = "Listas";
    Blockly.Msg.CATEGORY_LOGIC = "Lógica";
    Blockly.Msg.CATEGORY_MATH = "Matemáticas";
    Blockly.Msg.CATEGORY_VARIALBLES = "Variables";
    Blockly.Msg.CATEGORY_FUN = "Diversión";
    Blockly.Msg.CATEGORY_MISC = "Misc";

    Blockly.Msg.COLOR_RANDOM = "color aleatorio";

    Blockly.Msg.LOOP_FOREVER_REPEAT = "Repetir";
    Blockly.Msg.LOOP_FOREVER_FOREVER = "siempre";

    Blockly.Msg.LOOP_X_TIMES_REPEAT = "Repetir %1 veces";

    Blockly.Msg.LOOP_EVERY_REPEAT = "Cada";

    Blockly.Msg.LOOP_IN = "En %1 %2";

    Blockly.Msg.GLOBAL_EVENT = "Cuando %1";
    Blockly.Msg.APP_STARTS = "comienza la app";

    Blockly.Msg.KEY_EVENT = "Cuando la tecla %1 está %2";

    Blockly.Msg.RANDOM_CAT = "categoría aleatoria";

    Blockly.Msg.BLOCK_VALUE = "valor";
    Blockly.Msg.BLOCK_SET_BACKGROUND_COLOR = "configurar el color de fondo a %1";
    Blockly.Msg.BLOCK_IS_CLICKED = "está clickeado";

    Blockly.Msg.BLOCK_UI_MOVE_BY = "moverse %1 píxeles";
    Blockly.Msg.BLOCK_UI_ROTATE = "girar %1 %2 grados";
    Blockly.Msg.BLOCK_UI_ROTATE_CLOCKWISE = "girar \u21BB %1 grados";
    Blockly.Msg.BLOCK_UI_ROTATE_COUNTER_CLOCKWISE = "girar \u21BA %1 grados";
    Blockly.Msg.BLOCK_UI_ABSOLUTE_ROTATE = "apuntar a %1 grados";
    Blockly.Msg.BLOCK_UI_SCALE = "configurar el tamaño a %1 %";
    Blockly.Msg.BLOCK_UI_RELATIVE_SCALE = "cambiar el tamaño %1 %";
    Blockly.Msg.BLOCK_UI_SET_X_Y = "moverse a x %1, y %2";
    Blockly.Msg.BLOCK_UI_SET_X = "configurar x a %1";
    Blockly.Msg.BLOCK_UI_SET_Y = "configurar y a %1";
    Blockly.Msg.BLOCK_UI_VISIBILITY_SHOW = "Mostrar";
    Blockly.Msg.BLOCK_UI_VISIBILITY_HIDE = "Ocultar";
    Blockly.Msg.BLOCK_UI_TOGGLE_VISIBILITY = "cambiar visibilidad";
    Blockly.Msg.BLOCK_UI_X = "posición de x";
    Blockly.Msg.BLOCK_UI_Y = "posición de y";
    Blockly.Msg.BLOCK_UI_SIZE = "tamaño";
    Blockly.Msg.BLOCK_UI_ROTATION = "rotación";

    Blockly.Msg.BLOCK_DATA_REFRESH = "actualizar data";
    Blockly.Msg.BLOCK_DATA_SET_CONFIG = "configurar %1 a %2";
    Blockly.Msg.BLOCK_DATA_FOR_EACH = "para cada item en ";
    Blockly.Msg.BLOCK_DATA_UPDATED = "actualizada";

    Blockly.Msg.BLOCK_BOX_SET_STROKE_SIZE = "configurar el trazo a %1";
    Blockly.Msg.BLOCK_BOX_SET_STROKE_COLOR = "configurar el color del trazo a %1";

    Blockly.Msg.BLOCK_BUTTON_LABEL = "etiqueta";
    Blockly.Msg.BLOCK_BUTTON_SET_LABEL = "configurar etiqueta a %1";
    Blockly.Msg.BLOCK_BUTTON_SET_TEXT_COLOR = "configurar el color del texto a %1";

    Blockly.Msg.BLOCK_CLOCK_CURRENT = "actual %1";
    Blockly.Msg.BLOCK_CLOCK_YEAR = "Año";
    Blockly.Msg.BLOCK_CLOCK_MONTH = "Mes";
    Blockly.Msg.BLOCK_CLOCK_DAY = "Día";
    Blockly.Msg.BLOCK_CLOCK_HOUR = "Hora";
    Blockly.Msg.BLOCK_CLOCK_MINUTE = "Minutos";
    Blockly.Msg.BLOCK_CLOCK_SECONDS = "Segundos";
    Blockly.Msg.BLOCK_CLOCK_DATE = "Fecha";
    Blockly.Msg.BLOCK_CLOCK_TIME = "Hora";

    Blockly.Msg.BLOCK_MAP_MOVE_MARKER = "move marker to lat %1 long %2";

    Blockly.Msg.BLOCK_MIC_VOLUME = "volúmen";
    Blockly.Msg.BLOCK_MIC_PITCH = "tono";
    Blockly.Msg.BLOCK_MIC_WHEN_VOLUME = "cuando el volúmen es %1 %2";
    Blockly.Msg.BLOCK_MIC_OVER = "over";
    Blockly.Msg.BLOCK_MIC_UNDER = "under";


    Blockly.Msg.BLOCK_OSC_SET_SPEED = "configurar velocidad %1";
    Blockly.Msg.BLOCK_OSC_SPEED = "velocidad";
    Blockly.Msg.BLOCK_OSC_SET_DELAY = "configurar retraso %1";
    Blockly.Msg.BLOCK_OSC_DELAY = "retraso";

    Blockly.Msg.BLOCK_PICTURE_LIST_LENGTH = "longitud";
    Blockly.Msg.BLOCK_PICTURE_LIST_ADD_PICTURE = "añadir imagen %1";
    Blockly.Msg.BLOCK_PICTURE_LIST_GET_PICTURE = "obtener imagen %1 de lista";
    Blockly.Msg.BLOCK_PICTURE_LIST_FOR_EACH = "para cada imagen";
    Blockly.Msg.BLOCK_PICTURE_LIST_PICTURE = "imagen";
    Blockly.Msg.BLOCK_PICTURE_LIST_PLAY = "play";
    Blockly.Msg.BLOCK_PICTURE_LIST_PAUSE = "pausa";
    Blockly.Msg.BLOCK_PICTURE_LIST_SET_SPEED = "configurar velocidad a %1";
    Blockly.Msg.BLOCK_PICTURE_LIST_SAVE_GIF = "guardar gif";

    Blockly.Msg.BLOCK_SCROLL_SCROLL = "desplazar %1";

    Blockly.Msg.BLOCK_SPEAKER_SAY = "decir %1 % velocidad %2 acento %3";
    Blockly.Msg.BLOCK_SPEAKER_BRITISH = "Inglés Británico";
    Blockly.Msg.BLOCK_SPEAKER_US = "Inglés Norteamericano";
    Blockly.Msg.BLOCK_SPEAKER_FRENCH = "Francés";
    Blockly.Msg.BLOCK_SPEAKER_GERMAN = "Alemán";
    Blockly.Msg.BLOCK_SPEAKER_ITALIAN = "Italiano";
    Blockly.Msg.BLOCK_SPEAKER_PLAY = "reproducir %1";
    Blockly.Msg.BLOCK_SPEAKER_LOOP = "repetir %1";

    Blockly.Msg.BLOCK_STICKER_SET = "configurar a %1";
    Blockly.Msg.BLOCK_STICKER_RANDOM = "sticker aleatorio";
    Blockly.Msg.BLOCK_STICKER_RANDOM_FROM = "aleatorio %1";

    Blockly.Msg.BLOCK_TEXT_SET = "configurar texto %1";
    Blockly.Msg.BLOCK_TEXT_TEXT = "texto";

    Blockly.Msg.BLOCK_TEXT_INPUT_CHANGED = "ha cambiado";
    Blockly.Msg.BLOCK_TEXT_INPUT_PLACEHOLDER = "marcador de posición";
    Blockly.Msg.BLOCK_TEXT_INPUT_SET_VALUE = "configurar valor a %1";
    Blockly.Msg.BLOCK_TEXT_INPUT_SET_PLACEHOLDER = "configurar marcador de pos. a %1";

    Blockly.Msg.BLOCK_CANVAS_SETBACKGROUND_COLOR = "color de fondo %1";
    Blockly.Msg.BLOCK_CANVAS_LINE_TO = "línea en x %1 y %2";
    Blockly.Msg.BLOCK_CANVAS_LINE_ALONG = "línea a lo largo %1 abajo %2";
    Blockly.Msg.BLOCK_CANVAS_FILL_COLOR = "color de relleno %1";
    Blockly.Msg.BLOCK_CANVAS_STROKE = "color del trazo %1 grosor %2";
    Blockly.Msg.BLOCK_CANVAS_CIRCLE = "radio del círculo %1";
    Blockly.Msg.BLOCK_CANVAS_ELIPSE = "ancho de la elipse %1 altura %2";
    Blockly.Msg.BLOCK_CANVAS_SQUARE = "tamaño del cuadrado %1";
    Blockly.Msg.BLOCK_CANVAS_RECTANGLE = "ancho del rectángulo %1 altura %2";
    Blockly.Msg.BLOCK_CANVAS_ARC = "arco %1 %2 %3 %4";
    Blockly.Msg.BLOCK_CANVAS_POLYGON = "polígono";
    Blockly.Msg.BLOCK_CANVAS_CLOSE_PATH = "cerrar ruta";
    Blockly.Msg.BLOCK_CANVAS_PIXEL = "píxel";
    Blockly.Msg.BLOCK_CANVAS_MOVE_TO = "moverse a x %1 y %2";
    Blockly.Msg.BLOCK_CANVAS_MOVE_TO_RANDOM = "moverse a un punto aleatorio";
    Blockly.Msg.BLOCK_CANVAS_MOVE_BY = "moverse a través de x %1 y %2";

    Blockly.Msg.BLOCK_WEATHER_IS = "está %1";
    Blockly.Msg.BLOCK_WEATHER_SUNNY = "soleado";
    Blockly.Msg.BLOCK_WEATHER_RAINY = "lluvioso";
    Blockly.Msg.BLOCK_WEATHER_CLOUDY = "nublado";
    Blockly.Msg.BLOCK_WEATHER_SNOWY = "nevado";

    Blockly.Msg.BLOCK_LIGHT_ANIMATION_PLAY = "reproducir";
    Blockly.Msg.BLOCK_LIGHT_ANIMATION_STOP = "parar";
    Blockly.Msg.BLOCK_LIGHT_ANIMATION_GO_TO_FRAME = "ir al fotograma nº %1";
    Blockly.Msg.BLOCK_LIGHT_ANIMATION_SET_SPEED = "configurar velocidad a %1";

    Blockly.Msg.BLOCK_LIGHT_ANIMATION_DISPLAY_SET_ANIMATION = "configurar animación a %1";

    Blockly.Msg.BLOCK_LIGHT_CIRCLE_SET_RADIUS = "configurar radio a %1";
    Blockly.Msg.BLOCK_LIGHT_CIRCLE_SET_COLOR = "configurar color a %1";
    Blockly.Msg.BLOCK_LIGHT_CIRCLE_RADIUS = "radio";
    Blockly.Msg.BLOCK_LIGHT_CIRCLE_COLOR = "color";

    Blockly.Msg.BLOCK_LIGHT_RECTANGLE_SET_WIDTH = "configurar ancho a %1";
    Blockly.Msg.BLOCK_LIGHT_RECTANGLE_SET_HEIGHT = "configurar altura a %1";
    Blockly.Msg.BLOCK_LIGHT_RECTANGLE_WIDTH = "anchura";
    Blockly.Msg.BLOCK_LIGHT_RECTANGLE_HEIGHT = "altura";

    Blockly.Msg.BLOCK_FIREWORKS_REPEAT = "repetir 10 veces %1 %2";
    Blockly.Msg.BLOCK_FIREWORKS_AT = "fuegos artificiales en %1";
    Blockly.Msg.BLOCK_FIREWORKS_ANYWHERE = "cualquier lugar";

    Blockly.Msg.BLOCK_TALKING_FACE_SAY = "Decir %1";
    Blockly.Msg.BLOCK_TALKING_FACE_SUPERPOWERS = "¡Ahora tienes superpoderes!";
    Blockly.Msg.BLOCK_TALKING_FACE_SAY_IN = "Decir en %1 %2";
    Blockly.Msg.BLOCK_TALKING_FACE_SCOTTISH = "Escocés";
    Blockly.Msg.BLOCK_TALKING_FACE_ENGLISH = "Inglés Británico";
    Blockly.Msg.BLOCK_TALKING_FACE_AMERICAN = "Inglés Norteamericano";
    Blockly.Msg.BLOCK_TALKING_FACE_ITALIAN = "Italiano";
    Blockly.Msg.BLOCK_TALKING_FACE_FRENCH = "Francés";
    Blockly.Msg.BLOCK_TALKING_FACE_BUBBLES = "Burbujas";

    Blockly.Msg.BLOCK_GYRO_ACCELEROMETER_GYRO_AXIS = "Giroscopio %1 eje";
    Blockly.Msg.BLOCK_GYRO_ACCELEROMETER_ACCEL_AXIS = "Acelerómetro %1 eje";

    window.CustomBlocklyMsg = Blockly.Msg;

})(window.Blockly = window.Blockly || {});
