(function (Blockly) {
    Blockly.Msg = Blockly.Msg || {};

    Blockly.Msg.CATEGORY_COLOR = "Color";
    Blockly.Msg.CATEGORY_CONTROL = "Control";
    Blockly.Msg.CATEGORY_EVENTS = "Events";
    Blockly.Msg.CATEGORY_LISTS = "Lists";
    Blockly.Msg.CATEGORY_LOGIC = "Logic";
    Blockly.Msg.CATEGORY_MATH = "Math";
    Blockly.Msg.CATEGORY_VARIABLES = "Variables";
    Blockly.Msg.CATEGORY_FUN = "Fun";
    Blockly.Msg.CATEGORY_MISC = "Misc";

    Blockly.Msg.COLOR_RANDOM = "random color";

    Blockly.Msg.LOOP_FOREVER_REPEAT = "Repeat";
    Blockly.Msg.LOOP_FOREVER_FOREVER = "forever";

    Blockly.Msg.LOOP_X_TIMES_REPEAT = "Repeat %1 times";

    Blockly.Msg.LOOP_EVERY_REPEAT = "Every";

    Blockly.Msg.LOOP_IN = "In %1 %2";

    Blockly.Msg.GLOBAL_EVENT = "When %1";
    Blockly.Msg.APP_STARTS = "app starts";

    Blockly.Msg.KEY_EVENT = "When key %1 is %2";

    Blockly.Msg.RANDOM_CAT = "random cat";

    Blockly.Msg.BLOCK_VALUE = "value";
    Blockly.Msg.BLOCK_SET_BACKGROUND_COLOR = "set background color to %1";
    Blockly.Msg.BLOCK_IS_CLICKED = "is clicked";

    Blockly.Msg.BLOCK_UI_MOVE_BY = "move  %1 pixels";
    Blockly.Msg.BLOCK_UI_ROTATE = "turn %1 %2 degrees";
    Blockly.Msg.BLOCK_UI_ROTATE_CLOCKWISE = "turn \u21BB %1 degrees";
    Blockly.Msg.BLOCK_UI_ROTATE_COUNTER_CLOCKWISE = "turn \u21BA %1 degrees";
    Blockly.Msg.BLOCK_UI_ABSOLUTE_ROTATE = "point to %1 degrees";
    Blockly.Msg.BLOCK_UI_SCALE = "set size to %1 %";
    Blockly.Msg.BLOCK_UI_RELATIVE_SCALE = "change size by %1 %";
    Blockly.Msg.BLOCK_UI_SET_X_Y = "move to x %1, y %2";
    Blockly.Msg.BLOCK_UI_SET_X = "set x to %1";
    Blockly.Msg.BLOCK_UI_SET_Y = "set y to %1";
    Blockly.Msg.BLOCK_UI_VISIBILITY_SHOW = "Show";
    Blockly.Msg.BLOCK_UI_VISIBILITY_HIDE = "Hide";
    Blockly.Msg.BLOCK_UI_TOGGLE_VISIBILITY = "toggle visibility";
    Blockly.Msg.BLOCK_UI_X = "x position";
    Blockly.Msg.BLOCK_UI_Y = "y position";
    Blockly.Msg.BLOCK_UI_SIZE = "size";
    Blockly.Msg.BLOCK_UI_ROTATION = "rotation";

    Blockly.Msg.DIRECTION_UP = "up";
    Blockly.Msg.DIRECTION_DOWN = "down";
    Blockly.Msg.DIRECTION_LEFT = "left";
    Blockly.Msg.DIRECTION_RIGHT = "right";

    Blockly.Msg.BLOCK_DATA_REFRESH = "refresh data";
    Blockly.Msg.BLOCK_DATA_SET_CONFIG = "set %1 to %2";
    Blockly.Msg.BLOCK_DATA_FOR_EACH = "for each item in";
    Blockly.Msg.BLOCK_DATA_UPDATED = "updated";

    Blockly.Msg.BLOCK_BOX_SET_STROKE_SIZE = "set stroke size to %1";
    Blockly.Msg.BLOCK_BOX_SET_STROKE_COLOR = "set stroke color to %1";

    Blockly.Msg.BLOCK_BUTTON_LABEL = "label";
    Blockly.Msg.BLOCK_BUTTON_SET_LABEL = "set label to %1";
    Blockly.Msg.BLOCK_BUTTON_SET_TEXT_COLOR = "set text color to %1";

    Blockly.Msg.BLOCK_CLOCK_CURRENT = "current %1";
    Blockly.Msg.BLOCK_CLOCK_YEAR = "Year";
    Blockly.Msg.BLOCK_CLOCK_MONTH = "Month";
    Blockly.Msg.BLOCK_CLOCK_DAY = "Day";
    Blockly.Msg.BLOCK_CLOCK_HOUR = "Hour";
    Blockly.Msg.BLOCK_CLOCK_MINUTE = "Minute";
    Blockly.Msg.BLOCK_CLOCK_SECONDS = "Seconds";
    Blockly.Msg.BLOCK_CLOCK_DATE = "Date";
    Blockly.Msg.BLOCK_CLOCK_TIME = "Time";

    Blockly.Msg.BLOCK_MAP_MOVE_MARKER = "move marker to lat %1 long %2";

    Blockly.Msg.BLOCK_MIC_VOLUME = "volume";
    Blockly.Msg.BLOCK_MIC_PITCH = "pitch";
    Blockly.Msg.BLOCK_MIC_WHEN_VOLUME = "when volume goes %1 %2";
    Blockly.Msg.BLOCK_MIC_OVER = "over";
    Blockly.Msg.BLOCK_MIC_UNDER = "under";


    Blockly.Msg.BLOCK_OSC_SET_SPEED = "set speed %1";
    Blockly.Msg.BLOCK_OSC_SPEED = "speed";
    Blockly.Msg.BLOCK_OSC_SET_DELAY = "set delay %1";
    Blockly.Msg.BLOCK_OSC_DELAY = "delay";

    Blockly.Msg.BLOCK_PICTURE_LIST_LENGTH = "length";
    Blockly.Msg.BLOCK_PICTURE_LIST_ADD_PICTURE = "add picture %1";
    Blockly.Msg.BLOCK_PICTURE_LIST_GET_PICTURE = "get picture %1 in list";
    Blockly.Msg.BLOCK_PICTURE_LIST_FOR_EACH = "for each picture";
    Blockly.Msg.BLOCK_PICTURE_LIST_PICTURE = "picture";
    Blockly.Msg.BLOCK_PICTURE_LIST_PLAY = "play";
    Blockly.Msg.BLOCK_PICTURE_LIST_PAUSE = "pause";
    Blockly.Msg.BLOCK_PICTURE_LIST_SET_SPEED = "set speed to %1";
    Blockly.Msg.BLOCK_PICTURE_LIST_SAVE_GIF = "save gif";

    Blockly.Msg.BLOCK_SCROLL_SCROLL = "scroll %1";

    Blockly.Msg.BLOCK_SPEAKER_SAY = "say %1 % speed %2 accent %3";
    Blockly.Msg.BLOCK_SPEAKER_BRITISH = "British English";
    Blockly.Msg.BLOCK_SPEAKER_US = "US English";
    Blockly.Msg.BLOCK_SPEAKER_FRENCH = "French";
    Blockly.Msg.BLOCK_SPEAKER_GERMAN = "German";
    Blockly.Msg.BLOCK_SPEAKER_ITALIAN = "Italian";
    Blockly.Msg.BLOCK_SPEAKER_PLAY = "play %1";
    Blockly.Msg.BLOCK_SPEAKER_LOOP = "loop %1";

    Blockly.Msg.BLOCK_STICKER_SET = "set to %1";
    Blockly.Msg.BLOCK_STICKER_RANDOM = "random sticker";
    Blockly.Msg.BLOCK_STICKER_RANDOM_FROM = "random %1";

    Blockly.Msg.BLOCK_TEXT_SET = "set text to %1";
    Blockly.Msg.BLOCK_TEXT_TEXT = "text";

    Blockly.Msg.BLOCK_TEXT_INPUT_CHANGED = "has changed";
    Blockly.Msg.BLOCK_TEXT_INPUT_PLACEHOLDER = "placeholder";
    Blockly.Msg.BLOCK_TEXT_INPUT_SET_VALUE = "set value to %1";
    Blockly.Msg.BLOCK_TEXT_INPUT_SET_PLACEHOLDER = "set placeholder to %1";

    Blockly.Msg.BLOCK_CANVAS_SETBACKGROUND_COLOR = "background color %1";
    Blockly.Msg.BLOCK_CANVAS_LINE_TO = "line to x %1 y %2";
    Blockly.Msg.BLOCK_CANVAS_LINE_ALONG = "line along %1 down %2";
    Blockly.Msg.BLOCK_CANVAS_FILL_COLOR = "fill color %1";
    Blockly.Msg.BLOCK_CANVAS_STROKE = "stroke color %1 thickness %2";
    Blockly.Msg.BLOCK_CANVAS_CIRCLE = "circle radius %1";
    Blockly.Msg.BLOCK_CANVAS_ELIPSE = "ellipse width %1 height %2";
    Blockly.Msg.BLOCK_CANVAS_SQUARE = "square size %1";
    Blockly.Msg.BLOCK_CANVAS_RECTANGLE = "rectangle width %1 height %2";
    Blockly.Msg.BLOCK_CANVAS_ARC = "arc %1 %2 %3 %4";
    Blockly.Msg.BLOCK_CANVAS_POLYGON = "polygon";
    Blockly.Msg.BLOCK_CANVAS_CLOSE_PATH = "close path";
    Blockly.Msg.BLOCK_CANVAS_PIXEL = "pixel";
    Blockly.Msg.BLOCK_CANVAS_MOVE_TO = "move to x %1 y %2";
    Blockly.Msg.BLOCK_CANVAS_MOVE_TO_RANDOM = "move to random point";
    Blockly.Msg.BLOCK_CANVAS_MOVE_BY = "move by x %1 y %2";

    Blockly.Msg.BLOCK_WEATHER_IS = "is %1";
    Blockly.Msg.BLOCK_WEATHER_SUNNY = "sunny";
    Blockly.Msg.BLOCK_WEATHER_RAINY = "rainy";
    Blockly.Msg.BLOCK_WEATHER_CLOUDY = "cloudy";
    Blockly.Msg.BLOCK_WEATHER_SNOWY = "snowy";

    Blockly.Msg.BLOCK_LIGHT_MOVE_BY = "move %1 by %2 pixels";

    Blockly.Msg.BLOCK_LIGHT_ANIMATION_PLAY = "play";
    Blockly.Msg.BLOCK_LIGHT_ANIMATION_STOP = "stop";
    Blockly.Msg.BLOCK_LIGHT_ANIMATION_GO_TO_FRAME = "go to frame nº %1";
    Blockly.Msg.BLOCK_LIGHT_ANIMATION_SET_SPEED = "set speed to %1";

    Blockly.Msg.BLOCK_LIGHT_ANIMATION_DISPLAY_SET_ANIMATION = "set animation to %1";

    Blockly.Msg.BLOCK_LIGHT_CIRCLE_SET_RADIUS = "set radius to %1";
    Blockly.Msg.BLOCK_LIGHT_CIRCLE_SET_COLOR = "set color to %1";
    Blockly.Msg.BLOCK_LIGHT_CIRCLE_RADIUS = "radius";
    Blockly.Msg.BLOCK_LIGHT_CIRCLE_COLOR = "color";

    Blockly.Msg.BLOCK_LIGHT_RECTANGLE_SET_WIDTH = "set width to %1";
    Blockly.Msg.BLOCK_LIGHT_RECTANGLE_SET_HEIGHT = "set height to %1";
    Blockly.Msg.BLOCK_LIGHT_RECTANGLE_WIDTH = "width";
    Blockly.Msg.BLOCK_LIGHT_RECTANGLE_HEIGHT = "height";

    Blockly.Msg.BLOCK_FIREWORKS_REPEAT = "repeat 10 times %1 %2";
    Blockly.Msg.BLOCK_FIREWORKS_AT = "fireworks at %1";
    Blockly.Msg.BLOCK_FIREWORKS_ANYWHERE = "anywhere";

    Blockly.Msg.BLOCK_TALKING_FACE_SAY = "Say %1";
    Blockly.Msg.BLOCK_TALKING_FACE_SUPERPOWERS = "You now have superpowers!";
    Blockly.Msg.BLOCK_TALKING_FACE_SAY_IN = "Say in %1 %2";
    Blockly.Msg.BLOCK_TALKING_FACE_SCOTTISH = "Scottish";
    Blockly.Msg.BLOCK_TALKING_FACE_ENGLISH = "English";
    Blockly.Msg.BLOCK_TALKING_FACE_AMERICAN = "American";
    Blockly.Msg.BLOCK_TALKING_FACE_ITALIAN = "Italian";
    Blockly.Msg.BLOCK_TALKING_FACE_FRENCH = "French";
    Blockly.Msg.BLOCK_TALKING_FACE_BUBBLES = "Bubbles";

    Blockly.Msg.BLOCK_GYRO_ACCELEROMETER_GYRO_AXIS = "Gyroscope %1 axis";
    Blockly.Msg.BLOCK_GYRO_ACCELEROMETER_ACCEL_AXIS = "Accelerometer %1 axis";

    window.CustomBlocklyMsg = Blockly.Msg;

})(window.Blockly = window.Blockly || {});
