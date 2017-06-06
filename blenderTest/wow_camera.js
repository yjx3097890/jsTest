b4w.register('wow_camera', function (exports, require) {

var m_cam   = require("camera");
var m_app   = require("app");
var m_cfg   = require("config");
var m_cons  = require("constraints");
var m_cont  = require("container");
var m_ctl   = require("controls");
var m_data  = require("data");
var m_dbg   = require("debug");
var m_input = require("input");
var m_main  = require("main");
var m_phy   = require("physics");
var m_print = require("print");
var m_screen = require("screen");
var m_scs   = require("scenes");
var m_trans = require("transform");
var m_util  = require("util");
var m_vec3  = require("vec3");

     document.oncontextmenu=new Function("event.returnValue=false;");
     document.onselectstart=new Function("event.returnValue=false;");

function trans_hover_cam_horiz_local(camobj, dir, fact) {
    var dist = Math.max(m_cam.hover_get_distance(camobj), HOVER_SPEED_MIN);

    var obj_quat = m_trans.get_rotation(camobj, _quat4_tmp);
    var abs_dir = m_util.quat_to_dir(obj_quat, dir, _vec3_tmp);
    abs_dir[2] = 0;
    m_vec3.normalize(abs_dir, abs_dir);
    m_vec3.scale(abs_dir, dist * fact, abs_dir);

    var obj_trans = m_trans.get_translation(camobj, _vec3_tmp2);
    m_vec3.add(obj_trans, abs_dir, obj_trans)
    m_cam.set_translation(camobj, obj_trans);
}

function zoom_hover_cam(camobj, fact) {
    var limits = m_cam.hover_get_vertical_limits(camobj, _limits_tmp);
    if (limits.up != limits.down) {
        var y_angle = m_cam.get_camera_angles(camobj, _vec2_tmp2)[1];
        var angle_factor = (limits.down - y_angle) / (limits.down - limits.up);
        var dist_limits = m_cam.hover_get_distance_limits(camobj, _limits_tmp);
        angle_factor = Math.max(angle_factor, HOVER_ZOOM_FACTOR_MIN / dist_limits.max);
        m_cam.hover_rotate(camobj, 0, angle_factor * fact);
    }
}

function trans_eye_cam_local(camobj, fact_x, fact_y, fact_z) {
    fact_x *= EYE_KEY_TRANS_FACTOR;
    fact_y *= EYE_KEY_TRANS_FACTOR;
    fact_z *= EYE_KEY_TRANS_FACTOR;
    m_trans.move_local(camobj, fact_x, fact_y, fact_z);
}

function calc_fact_from(fact_to) {
    return fact_to / (1 - fact_to);
}

function trans_targ_cam_local(camobj, fact_view, elapsed) {
    var dist = m_cam.target_get_distance(camobj);
    var abs_fact_view = Math.abs(fact_view);
    var fact = Math.pow(abs_fact_view * elapsed, TARGET_KEY_ZOOM_POW1
            - Math.pow(abs_fact_view * elapsed, TARGET_KEY_ZOOM_POW2));

    if (fact_view < 0)
        if (dist > EPSILON_DISTANCE)
            fact_view = - dist * fact;
        else
            fact_view = 0;
    else
        fact_view = dist * calc_fact_from(fact);

    m_trans.move_local(camobj, 0, 0, fact_view);
}

function get_dest_mouse_touch(obj, value, fact, dist, dest_value) {
    var t_mult = dist * fact;

    for (var i = value; i > 0; --i) {
        dist += t_mult;
        dest_value += t_mult;
        t_mult = dist * fact;
    }
    return dest_value;
}

function get_dest_zoom(obj, value, velocity_zoom, dest_value, dev_fact,
        use_pivot) {

    if (use_pivot) {
        // camera zooming
        var cam_pivot = m_cam.target_get_pivot(obj, _vec3_tmp);
        var cam_eye = m_cam.get_translation(obj);
        var dist = m_vec3.dist(cam_pivot, cam_eye) + dest_value;

        if (value > 0)
            dest_value = get_dest_mouse_touch(obj, value,
                    -velocity_zoom, dist, dest_value);
        else
            dest_value = get_dest_mouse_touch(obj, -value,
                    calc_fact_from(velocity_zoom), dist, dest_value);
    } else
        // use_hover == True
        dest_value -= value * dev_fact * velocity_zoom;
    return dest_value;
}

exports.enable_camera_controls = function enable_camera_controls(
                    disable_default_pivot, 
                    disable_letter_controls,
                    disable_zoom,
                    element, 
                    allow_element_exit) {

    _disable_default_pivot = disable_default_pivot;
    _disable_letter_controls = disable_letter_controls;
    _disable_zoom = disable_zoom;

    var obj = m_scs.get_active_camera();
    m_app.enable_cam_controls_resetting(obj);

    var use_pivot = false;
    var character = null;
    var use_hover = false;

    switch (m_cam.get_move_style(obj)) {
    case m_cam.MS_TARGET_CONTROLS:
        use_pivot = !disable_default_pivot;
        break;
    case m_cam.MS_EYE_CONTROLS:
        character = m_scs.get_first_character();
        break;
    case m_cam.MS_STATIC:
        return;
    case m_cam.MS_HOVER_CONTROLS:
        use_hover = true;
        break;
    }

    var velocity = m_cam.get_velocities(obj, _velocity_tmp);

    var elapsed = m_ctl.create_elapsed_sensor();

    if (m_phy.has_simulated_physics(obj)) {

        var collision = m_ctl.create_collision_sensor(obj, null, true);

        var collision_cb = function(obj, id, pulse) {
            var coll_dist = m_ctl.get_sensor_payload(obj, id, 0).coll_dist;
            if (coll_dist < 0) {
                var coll_norm = m_ctl.get_sensor_payload(obj, id, 0).coll_norm;
                var recover_offset = _vec3_tmp;
                m_vec3.scale(coll_norm, -0.25 * coll_dist, recover_offset);
                var trans = m_trans.get_translation(obj, _vec3_tmp2);
                m_vec3.add(trans, recover_offset, trans);
                m_trans.set_translation_v(obj, trans);
            }
        }
        m_ctl.create_sensor_manifold(obj, "CAMERA_COLLISION", m_ctl.CT_POSITIVE,
                [collision], null, collision_cb);
    }

    if (character) {
        // apply camera transform to character
        var trans = m_trans.get_translation(obj);
        var quat  = m_trans.get_rotation(obj);
        var char_quat = m_util.cam_quat_to_mesh_quat(quat);

        trans[2] -= CHAR_HEAD_POSITION;
     //   m_phy.set_transform(character, trans, char_quat);
        m_cons.append_stiff_trans(obj, character, [0, 0, 0.5]);

        var char_dir = new Float32Array(2);

        var is_fly = true;
        m_phy.set_character_move_type(character, m_phy.CM_FLY);

        var move_type_cb = function() {
            is_fly = !is_fly;
            m_phy.set_character_move_type(character,
                is_fly ? m_phy.CM_FLY : m_phy.CM_WALK);
        }

        m_ctl.create_kb_sensor_manifold(obj, "TOGGLE_CHAR_MOVE_TYPE",
                m_ctl.CT_SHOT, m_ctl.KEY_C, move_type_cb);
    }

    var key_cb = function(obj, id, pulse) {
        if (pulse == 1) {

            var elapsed = m_ctl.get_sensor_value(obj, id, 0);

            m_cam.get_velocities(obj, velocity);
            switch (id) {
            case "FORWARD":
                if (character)
                    char_dir[0] = 1;
                else if (use_hover) {
                    var hover_angle = m_cam.get_camera_angles(obj, _vec2_tmp2)[1];
                    var axis = (Math.abs(hover_angle) >= Math.PI / 4) ? m_util.AXIS_Y : m_util.AXIS_MZ;
                    trans_hover_cam_horiz_local(obj, axis,
                            velocity.trans * HOVER_KEY_TRANS_FACTOR * elapsed);
                } else if (use_pivot)
                    trans_targ_cam_local(obj, -velocity.zoom, elapsed);
                else
                    trans_eye_cam_local(obj, 0, 0, -velocity.trans * elapsed);
                break;
            case "BACKWARD":
                if (character)
                    char_dir[0] = -1;
                else if (use_hover) {
                    var hover_angle = m_cam.get_camera_angles(obj, _vec2_tmp2)[1];
                    var axis = (Math.abs(hover_angle) >= Math.PI / 4) ? m_util.AXIS_MY : m_util.AXIS_Z;
                    trans_hover_cam_horiz_local(obj, axis,
                            velocity.trans * HOVER_KEY_TRANS_FACTOR * elapsed);
                } else if (use_pivot)
                    trans_targ_cam_local(obj, velocity.zoom, elapsed);
                else
                    trans_eye_cam_local(obj, 0, 0, velocity.trans * elapsed);
                break;
            case "UP":
                if (use_hover)
                    zoom_hover_cam(obj, - velocity.zoom * HOVER_KEY_ZOOM_FACTOR 
                            * elapsed);
                else if (!character)
                    trans_eye_cam_local(obj, 0, velocity.trans * elapsed, 0);
                break;
            case "DOWN":
                if (use_hover)
                    zoom_hover_cam(obj, velocity.zoom * HOVER_KEY_ZOOM_FACTOR 
                            * elapsed);
                else if (!character)
                    trans_eye_cam_local(obj, 0, -velocity.trans * elapsed, 0);
                break;
            case "LEFT":
                if (character)
                    char_dir[1] = 1;
                else if (use_hover)
                    trans_hover_cam_horiz_local(obj, m_util.AXIS_MX,
                            velocity.trans * HOVER_KEY_TRANS_FACTOR * elapsed);
                else
                    trans_eye_cam_local(obj, -velocity.trans * elapsed, 0, 0);
                break;
            case "RIGHT":
                if (character)
                    char_dir[1] = -1;
                else if (use_hover)
                    trans_hover_cam_horiz_local(obj, m_util.AXIS_X,
                            velocity.trans * HOVER_KEY_TRANS_FACTOR * elapsed);
                else
                    trans_eye_cam_local(obj, velocity.trans * elapsed, 0, 0);
                break;
            case "ROT_LEFT":
                if (use_pivot)
                    m_cam.target_rotate(obj, -velocity.rot
                            * TARGET_EYE_KEY_ROT_FACTOR * elapsed, 0);
                else
                    m_cam.eye_rotate(obj, velocity.rot * TARGET_EYE_KEY_ROT_FACTOR
                            * elapsed, 0);
                break;
            case "ROT_RIGHT":
                if (use_pivot)
                    m_cam.target_rotate(obj, velocity.rot
                            * TARGET_EYE_KEY_ROT_FACTOR * elapsed, 0);
                else
                    m_cam.eye_rotate(obj, -velocity.rot * TARGET_EYE_KEY_ROT_FACTOR
                            * elapsed, 0);
                break;
            case "ROT_UP":
                if (use_pivot)
                    m_cam.target_rotate(obj, 0, -velocity.rot
                            * TARGET_EYE_KEY_ROT_FACTOR * elapsed);
                else
                    m_cam.eye_rotate(obj, 0, velocity.rot
                            * TARGET_EYE_KEY_ROT_FACTOR * elapsed);
                break;
            case "ROT_DOWN":
                if (use_pivot)
                    m_cam.target_rotate(obj, 0, velocity.rot
                            * TARGET_EYE_KEY_ROT_FACTOR * elapsed);
                else
                    m_cam.eye_rotate(obj, 0, -velocity.rot
                            * TARGET_EYE_KEY_ROT_FACTOR * elapsed);
                break;
            default:
                break;
            }

        } else {
            switch (id) {
            case "FORWARD":
            case "BACKWARD":
                if (character)
                    char_dir[0] = 0;
                break;
            case "LEFT":
            case "RIGHT":
                if (character)
                    char_dir[1] = 0;
                break;
            }
        }

        if (character) {
            m_phy.set_character_move_dir(character, char_dir[0], char_dir[1]);
            var angles = m_cam.get_camera_angles_char(obj, _vec2_tmp);
            m_phy.set_character_rotation(character, angles[0], angles[1]);
        }
    }

    var gmpd_indices = m_input.check_enable_gamepad_indices();
    if (gmpd_indices.length)
        var gamepad_id = gmpd_indices[gmpd_indices.length - 1];
    else
        var gamepad_id = 0;

    var key_w, key_s, key_a, key_d, key_r, key_f, gmpd_btn_6, gmpd_btn_7;
    var key_up, key_down, key_left, key_right;
    if (!disable_letter_controls) {
        key_w = m_ctl.create_keyboard_sensor(m_ctl.KEY_W);
        key_s = m_ctl.create_keyboard_sensor(m_ctl.KEY_S);
        key_a = m_ctl.create_keyboard_sensor(m_ctl.KEY_A);
        key_d = m_ctl.create_keyboard_sensor(m_ctl.KEY_D);
        key_r = m_ctl.create_keyboard_sensor(m_ctl.KEY_R);
        key_f = m_ctl.create_keyboard_sensor(m_ctl.KEY_F);
        gmpd_btn_6 = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_6,
                gamepad_id);
        gmpd_btn_7 = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_7,
                gamepad_id);

        key_up = m_ctl.create_keyboard_sensor(m_ctl.KEY_UP);
        key_down = m_ctl.create_keyboard_sensor(m_ctl.KEY_DOWN);
        key_left = m_ctl.create_keyboard_sensor(m_ctl.KEY_LEFT);
        key_right = m_ctl.create_keyboard_sensor(m_ctl.KEY_RIGHT);
    } else
        key_w = key_s = key_a = key_d = key_r = key_f = gmpd_btn_6 =
                gmpd_btn_7 = key_up = key_down = key_left = key_right =
                m_ctl.create_custom_sensor(0);

    var lh_axis = m_ctl.create_gamepad_axis_sensor(m_input.GMPD_AXIS_0, gmpd_indices);
    var lv_axis = m_ctl.create_gamepad_axis_sensor(m_input.GMPD_AXIS_1, gmpd_indices);

    var rh_axis = m_ctl.create_gamepad_axis_sensor(m_input.GMPD_AXIS_2, gmpd_indices);
    var rv_axis = m_ctl.create_gamepad_axis_sensor(m_input.GMPD_AXIS_3, gmpd_indices);

    // var key_single_logic = null;
    // var key_double_logic = function(s) {
    //     return s[0] && (s[1] || s[2]);
    // }
     var key_triple_logic = function(s) {
        return s[0] && (s[1] || s[2] || s[3]);
    }
    var key_double_pos_logic = function(s) {
        return s[0] && (s[1] || s[2] > AXIS_THRESHOLD);
    }
    var key_double_neg_logic = function(s) {
        return s[0] && (s[1] || s[2] < -AXIS_THRESHOLD);
    }
    var key_triple_pos_logic = function(s) {
        return s[0] && (s[1] || s[2] || s[3] > AXIS_THRESHOLD);
    }
    var key_triple_neg_logic = function(s) {
        return s[0] && (s[1] || s[2] || s[3] < -AXIS_THRESHOLD);
    }

    if (!use_hover) {
        m_ctl.create_sensor_manifold(obj, "FORWARD", m_ctl.CT_CONTINUOUS,
                [elapsed, key_w, lv_axis], key_double_neg_logic, key_cb);
        m_ctl.create_sensor_manifold(obj, "BACKWARD", m_ctl.CT_CONTINUOUS,
                [elapsed, key_s, lv_axis], key_double_pos_logic, key_cb);
    }

    if (use_pivot) {
        m_ctl.create_sensor_manifold(obj, "ROT_UP", m_ctl.CT_CONTINUOUS,
                [elapsed, key_up, key_r, rv_axis], key_triple_neg_logic, key_cb);
        m_ctl.create_sensor_manifold(obj, "ROT_DOWN", m_ctl.CT_CONTINUOUS,
                [elapsed, key_down, key_f, rv_axis], key_triple_pos_logic, key_cb);
        m_ctl.create_sensor_manifold(obj, "ROT_LEFT", m_ctl.CT_CONTINUOUS,
                [elapsed, key_left, key_a, rh_axis], key_triple_neg_logic, key_cb);
        m_ctl.create_sensor_manifold(obj, "ROT_RIGHT", m_ctl.CT_CONTINUOUS,
                [elapsed, key_right, key_d, rh_axis], key_triple_pos_logic, key_cb);
    } else if (use_hover) {
        m_ctl.create_sensor_manifold(obj, "LEFT", m_ctl.CT_CONTINUOUS,
                [elapsed, key_left, key_a, lh_axis], key_triple_neg_logic, key_cb);
        m_ctl.create_sensor_manifold(obj, "RIGHT", m_ctl.CT_CONTINUOUS,
                [elapsed, key_right, key_d, lh_axis], key_triple_pos_logic, key_cb);
        m_ctl.create_sensor_manifold(obj, "FORWARD", m_ctl.CT_CONTINUOUS,
                [elapsed, key_up, key_w, lv_axis], key_triple_neg_logic, key_cb);
        m_ctl.create_sensor_manifold(obj, "BACKWARD", m_ctl.CT_CONTINUOUS,
                [elapsed, key_down, key_s, lv_axis], key_triple_pos_logic, key_cb);
        m_ctl.create_sensor_manifold(obj, "UP", m_ctl.CT_CONTINUOUS,
                [elapsed, key_f, rv_axis], key_double_pos_logic, key_cb);
        m_ctl.create_sensor_manifold(obj, "DOWN", m_ctl.CT_CONTINUOUS,
                [elapsed, key_r, rv_axis], key_double_neg_logic, key_cb);
    } else {
        m_ctl.create_sensor_manifold(obj, "UP", m_ctl.CT_CONTINUOUS,
                [elapsed, key_r, gmpd_btn_6], key_triple_logic, key_cb);
        m_ctl.create_sensor_manifold(obj, "DOWN", m_ctl.CT_CONTINUOUS,
                [elapsed, key_f, gmpd_btn_7], key_triple_logic, key_cb);
        m_ctl.create_sensor_manifold(obj, "LEFT", m_ctl.CT_CONTINUOUS,
                [elapsed, key_a, lh_axis], key_double_neg_logic, key_cb);
        m_ctl.create_sensor_manifold(obj, "RIGHT", m_ctl.CT_CONTINUOUS,
                [elapsed, key_d, lh_axis], key_double_pos_logic, key_cb);
        m_ctl.create_sensor_manifold(obj, "ROT_UP", m_ctl.CT_CONTINUOUS,
                [elapsed, key_up, rv_axis], key_double_neg_logic, key_cb);
        m_ctl.create_sensor_manifold(obj, "ROT_DOWN", m_ctl.CT_CONTINUOUS,
                [elapsed, key_down, rv_axis], key_double_pos_logic, key_cb);
        m_ctl.create_sensor_manifold(obj, "ROT_LEFT", m_ctl.CT_CONTINUOUS,
                [elapsed, key_left, rh_axis], key_double_neg_logic, key_cb);
        m_ctl.create_sensor_manifold(obj, "ROT_RIGHT", m_ctl.CT_CONTINUOUS,
                [elapsed, key_right, rh_axis], key_double_pos_logic, key_cb);
    }

    if (!disable_zoom) {
        // mouse wheel: camera zooming and translation speed adjusting
        var dest_zoom_mouse = 0;
        var mouse_wheel = m_ctl.create_mouse_wheel_sensor(element);

        // camera zooming with touch
        var dest_zoom_touch = 0;
        var touch_zoom = m_ctl.create_touch_zoom_sensor(element);

        var mouse_wheel_cb = function(obj, id, pulse) {
            if (pulse == 1) {
                var value = m_ctl.get_sensor_value(obj, id, 0);
                m_cam.get_velocities(obj, velocity);
                if (use_pivot || use_hover) {
                    dest_zoom_mouse = get_dest_zoom(obj, value, velocity.zoom,
                            dest_zoom_mouse, HOVER_MOUSE_ZOOM_FACTOR, use_pivot);
                } else {
                    // translation speed adjusting
                    var factor = value * velocity.zoom;
                    velocity.trans *= (1 + factor);
                    m_cam.set_velocities(obj, velocity);
                }
            }
        }

        m_ctl.create_sensor_manifold(obj, "MOUSE_WHEEL", m_ctl.CT_LEVEL,
                [mouse_wheel], null, mouse_wheel_cb);

        var touch_zoom_cb = function(obj, id, pulse, param) {
            if (pulse == 1) {
                var value = m_ctl.get_sensor_value(obj, id, 0);
                m_cam.get_velocities(obj, velocity);

                if (m_ctl.get_sensor_payload(obj, id, 0)
                        === m_ctl.PL_MULTITOUCH_MOVE_ZOOM) {
                    dest_zoom_touch = get_dest_zoom(obj, value, velocity.zoom
                            * TARGET_TOUCH_ZOOM_FACTOR, dest_zoom_touch,
                            HOVER_TOUCH_ZOOM_FACTOR, use_pivot);
                }
            }
        }

        m_ctl.create_sensor_manifold(obj, "TOUCH_ZOOM", m_ctl.CT_LEVEL,
                [touch_zoom], null, touch_zoom_cb);

        // camera zoom smoothing
        var zoom_interp_cb = function(obj, id, pulse) {

            if (use_pivot || use_hover) {
                if (Math.abs(dest_zoom_mouse) > EPSILON_DELTA
                        || Math.abs(dest_zoom_touch) > EPSILON_DELTA) {
                    var value = m_ctl.get_sensor_value(obj, id, 0);
                    var zoom_mouse = m_util.smooth(dest_zoom_mouse, 0, value,
                            smooth_coeff_zoom_mouse());
                    dest_zoom_mouse -= zoom_mouse;

                    var zoom_touch = m_util.smooth(dest_zoom_touch, 0, value,
                            smooth_coeff_zoom_touch());
                    dest_zoom_touch -= zoom_touch;

                    if (use_hover) {
                        zoom_hover_cam(obj, - (zoom_mouse + zoom_touch));
                    } else {
                        var res_dist = m_cam.target_get_distance(obj)
                            + zoom_mouse + zoom_touch;
                        // NOTE: prevent zoom overshooting.
                        res_dist = Math.max(res_dist, EPSILON_DISTANCE);
                        m_cam.target_set_distance(obj, res_dist);
                    }
                } else {
                    dest_zoom_mouse = 0;
                    dest_zoom_touch = 0;
                }
            }
        }

        m_ctl.create_sensor_manifold(obj, "ZOOM_INTERPOL", m_ctl.CT_POSITIVE,
                [elapsed], null, zoom_interp_cb);
    }

    // camera rotation and translation with mouse
    var dest_x_mouse = 0;
    var dest_y_mouse = 0;

    // camera panning with mouse
    var dest_pan_x_mouse = 0;
    var dest_pan_y_mouse = 0;

    var mouse_cb = function(obj, id, pulse, param) {
        if (pulse == 1) {
            var value = m_ctl.get_sensor_value(obj, id, 1);

            m_cam.get_velocities(obj, velocity);
            if (!use_hover) {
                var left_mult  = TARGET_EYE_MOUSE_ROT_MULT_PX * velocity.rot;
                var right_mult = TARGET_EYE_MOUSE_PAN_MULT_PX * velocity.trans;
            } else {
                var left_mult  = HOVER_MOUSE_PAN_MULT_PX * velocity.trans;
                var right_mult = HOVER_MOUSE_ROT_MULT_PX * velocity.rot;
            }

            if (m_ctl.get_sensor_payload(obj, id, 0).which === 1) {
                dest_x_mouse += (param == "X") ? -value * left_mult : 0;
                dest_y_mouse += (param == "Y") ? -value * left_mult : 0;
            } else if (m_ctl.get_sensor_payload(obj, id, 0).which === 2
                    || m_ctl.get_sensor_payload(obj, id, 0).which === 3) {
                dest_pan_x_mouse += (param == "X") ? -value * right_mult : 0;
                dest_pan_y_mouse += (param == "Y") ? -value * right_mult : 0;
            }
        }
    }

    // camera panning with gamepad
    var dest_pan_x_gmpd = 0;
    var dest_pan_y_gmpd = 0;

    var gmpd_panning_x_pos_cb = function(obj, id, pulse) {
        m_cam.get_velocities(obj, velocity);
        dest_pan_x_gmpd += velocity.trans * TRANS_GMPD_KOEF;
    }
    var gmpd_panning_y_pos_cb = function(obj, id, pulse) {
        m_cam.get_velocities(obj, velocity);
        dest_pan_y_gmpd += velocity.zoom * ZOOM_GMPD_KOEF;
    }
    var gmpd_panning_x_neg_cb = function(obj, id, pulse) {
        m_cam.get_velocities(obj, velocity);
        dest_pan_x_gmpd -= velocity.trans * TRANS_GMPD_KOEF;
    }
    var gmpd_panning_y_neg_cb = function(obj, id, pulse) {
        m_cam.get_velocities(obj, velocity);
        dest_pan_y_gmpd -= velocity.zoom * ZOOM_GMPD_KOEF;
    }

    if (use_pivot) {
        m_ctl.create_sensor_manifold(obj, "GMPD_PAN_Y_POS", m_ctl.CT_CONTINUOUS,
                [gmpd_btn_6], null, gmpd_panning_y_pos_cb);
        m_ctl.create_sensor_manifold(obj, "GMPD_PAN_Y_NEG", m_ctl.CT_CONTINUOUS,
                [gmpd_btn_7], null, gmpd_panning_y_neg_cb);
        m_ctl.create_sensor_manifold(obj, "GMPD_PAN_X_POS", m_ctl.CT_CONTINUOUS,
                [lh_axis], function(s) {return s[0] < -AXIS_THRESHOLD}, gmpd_panning_x_neg_cb);
        m_ctl.create_sensor_manifold(obj, "GMPD_PAN_X_NEG", m_ctl.CT_CONTINUOUS,
                [lh_axis], function(s) {return s[0] > AXIS_THRESHOLD}, gmpd_panning_x_pos_cb);
    } else if (use_hover) {
        m_ctl.create_sensor_manifold(obj, "GMPD_PAN_X_POS", m_ctl.CT_CONTINUOUS,
                [rh_axis], function(s) {return s[0] < -AXIS_THRESHOLD}, gmpd_panning_x_neg_cb);
        m_ctl.create_sensor_manifold(obj, "GMPD_PAN_X_NEG", m_ctl.CT_CONTINUOUS,
                [rh_axis], function(s) {return s[0] > AXIS_THRESHOLD}, gmpd_panning_x_pos_cb);
    }

    if (allow_element_exit) {
        var mouse_move_x = m_ctl.create_mouse_move_sensor("X", window);
        var mouse_move_y = m_ctl.create_mouse_move_sensor("Y", window);
        var mouse_down_c = m_ctl.create_mouse_click_sensor(element);
        var mouse_down_w = m_ctl.create_mouse_click_sensor(window);

        var element_exit_state = false;
        var element_exit_logic = function(s) {
            if (s[2])
                element_exit_state = true;
            else if (!s[0])
                element_exit_state = false;
            return element_exit_state && s[0];
        }
        m_ctl.create_sensor_manifold(obj, "MOUSE_X", m_ctl.CT_POSITIVE,
                [mouse_down_w, mouse_move_x, mouse_down_c], element_exit_logic, mouse_cb, "X");
        m_ctl.create_sensor_manifold(obj, "MOUSE_Y", m_ctl.CT_POSITIVE,
                [mouse_down_w, mouse_move_y, mouse_down_c], element_exit_logic, mouse_cb, "Y");

        var device = m_input.get_device_by_type_element(m_input.DEVICE_MOUSE, window);
        m_input.switch_prevent_default(device, false);
    } else {
        var mouse_move_x = m_ctl.create_mouse_move_sensor("X", element);
        var mouse_move_y = m_ctl.create_mouse_move_sensor("Y", element);
        var mouse_down = m_ctl.create_mouse_click_sensor(element);
        m_ctl.create_sensor_manifold(obj, "MOUSE_X", m_ctl.CT_POSITIVE,
                [mouse_down, mouse_move_x], null, mouse_cb, "X");
        m_ctl.create_sensor_manifold(obj, "MOUSE_Y", m_ctl.CT_POSITIVE,
                [mouse_down, mouse_move_y], null, mouse_cb, "Y");
    }

    // camera rotation and translation with touch
    var dest_x_touch = 0;
    var dest_y_touch = 0;

    // camera panning with touch
    var dest_pan_x_touch = 0;
    var dest_pan_y_touch = 0;

    var touch_move_x = m_ctl.create_touch_move_sensor("X", element);
    var touch_move_y = m_ctl.create_touch_move_sensor("Y", element);

    var touch_cb = function(obj, id, pulse, param) {
        if (pulse == 1) {
            m_cam.get_velocities(obj, velocity);
            if (use_hover)
                var r_mult = HOVER_TOUCH_PAN_MULT_PX * velocity.trans;
            else
                var r_mult = TARGET_EYE_TOUCH_ROT_MULT_PX * velocity.rot;
            var value = m_ctl.get_sensor_value(obj, id, 0);
            if (m_ctl.get_sensor_payload(obj, id, 0).gesture
                    === m_ctl.PL_SINGLE_TOUCH_MOVE) {
                dest_x_touch += (param == "X") ? -value * r_mult : 0;
                dest_y_touch += (param == "Y") ? -value * r_mult : 0;
            } else if (m_ctl.get_sensor_payload(obj, id, 0).gesture
                    ===  m_ctl.PL_MULTITOUCH_MOVE_PAN) {
                if (!use_hover) {
                    var pan_mult = TARGET_EYE_TOUCH_PAN_MULT_PX * velocity.trans;
                } else {
                    var pan_mult = HOVER_TOUCH_ROT_MULT_PX * velocity.rot;
                }
                dest_pan_x_touch += (param == "X") ? -value * pan_mult : 0;
                dest_pan_y_touch += (param == "Y") ? -value * pan_mult : 0;
            }
        }
    }

    m_ctl.create_sensor_manifold(obj, "TOUCH_X", m_ctl.CT_POSITIVE,
            [touch_move_x], null, touch_cb, "X");
    m_ctl.create_sensor_manifold(obj, "TOUCH_Y", m_ctl.CT_POSITIVE,
            [touch_move_y], null, touch_cb, "Y");

    // camera rotation and translation smoothing
    var rot_trans_interp_cb = function(obj, id, pulse) {
        if (    Math.abs(dest_x_mouse) > EPSILON_DELTA ||
                Math.abs(dest_y_mouse) > EPSILON_DELTA ||
                Math.abs(dest_x_touch) > EPSILON_DELTA ||
                Math.abs(dest_y_touch) > EPSILON_DELTA ||
                Math.abs(dest_pan_x_mouse) > EPSILON_DELTA ||
                Math.abs(dest_pan_y_mouse) > EPSILON_DELTA ||
                Math.abs(dest_pan_x_touch) > EPSILON_DELTA ||
                Math.abs(dest_pan_y_touch) > EPSILON_DELTA ||
                Math.abs(dest_pan_x_gmpd) > EPSILON_DELTA ||
                Math.abs(dest_pan_y_gmpd) > EPSILON_DELTA) {

            var value = m_ctl.get_sensor_value(obj, id, 0);

            var x_mouse = m_util.smooth(dest_x_mouse, 0, value,
                    smooth_coeff_rot_trans_mouse());
            var y_mouse = m_util.smooth(dest_y_mouse, 0, value,
                    smooth_coeff_rot_trans_mouse());

            dest_x_mouse -= x_mouse;
            dest_y_mouse -= y_mouse;

            var x_touch = m_util.smooth(dest_x_touch, 0, value,
                    smooth_coeff_rot_trans_touch());
            var y_touch = m_util.smooth(dest_y_touch, 0, value,
                    smooth_coeff_rot_trans_touch());

            dest_x_touch -= x_touch;
            dest_y_touch -= y_touch;

            var trans_x_mouse = m_util.smooth(dest_pan_x_mouse, 0,
                    value, smooth_coeff_rot_trans_mouse());
            var trans_y_mouse = m_util.smooth(dest_pan_y_mouse, 0,
                    value, smooth_coeff_rot_trans_mouse());

            dest_pan_x_mouse -= trans_x_mouse;
            dest_pan_y_mouse -= trans_y_mouse;

            var trans_x_touch = m_util.smooth(dest_pan_x_touch, 0,
                    value, smooth_coeff_rot_trans_touch());
            var trans_y_touch = m_util.smooth(dest_pan_y_touch, 0,
                    value, smooth_coeff_rot_trans_touch());

            dest_pan_x_touch -= trans_x_touch;
            dest_pan_y_touch -= trans_y_touch;

            var trans_x_gmpd = m_util.smooth(dest_pan_x_gmpd, 0,
                    value, smooth_coeff_rot_trans_mouse());
            var trans_y_gmpd = m_util.smooth(dest_pan_y_gmpd, 0,
                    value, smooth_coeff_rot_trans_mouse());

            dest_pan_x_gmpd -= trans_x_gmpd;
            dest_pan_y_gmpd -= trans_y_gmpd;

            if (use_pivot) {
                m_cam.target_rotate(obj, x_mouse + x_touch,
                        y_mouse + y_touch);

                var dist = m_cam.target_get_distance(obj);
                m_cam.target_pan_pivot(obj,
                        dist * (trans_x_mouse + trans_x_touch + trans_x_gmpd),
                        dist * (trans_y_mouse + trans_y_touch + trans_y_gmpd));
            } else if (use_hover) {
                if (x_mouse + x_touch) {
                    trans_hover_cam_horiz_local(obj, m_util.AXIS_X,
                            (x_mouse + x_touch)
                            * HOVER_MOUSE_TOUCH_TRANS_FACTOR);
                }

                if (y_mouse + y_touch) {
                    var hover_angle = m_cam.get_camera_angles(obj, _vec2_tmp2)[1];
                    var axis = (Math.abs(hover_angle) > Math.PI / 4) ? m_util.AXIS_MY : m_util.AXIS_Z;
                    trans_hover_cam_horiz_local(obj, axis, (y_mouse + y_touch)
                            * HOVER_MOUSE_TOUCH_TRANS_FACTOR);
                }

                m_cam.hover_rotate(obj, trans_x_mouse + trans_x_touch + trans_x_gmpd, 0);
            } else {
                m_cam.eye_rotate(obj, (x_mouse + x_touch) * EYE_ROTATION_DECREMENT,
                        (y_mouse + y_touch) * EYE_ROTATION_DECREMENT);

                if (character) {
                    var angles = m_cam.get_camera_angles_char(obj, _vec2_tmp);
                    m_phy.set_character_rotation(character, angles[0], angles[1]);
                }
            }
        }
    }

    m_ctl.create_sensor_manifold(obj, "ROT_TRANS_INTERPOL", m_ctl.CT_POSITIVE,
            [elapsed], null, rot_trans_interp_cb);

    m_ctl.create_kb_sensor_manifold(obj, "DEC_STEREO_DIST", m_ctl.CT_SHOT,
            m_ctl.KEY_LEFT_SQ_BRACKET, function(obj, id, pulse) {
                var dist = m_cam.get_stereo_distance(obj);
                m_cam.set_stereo_distance(obj, 0.9 * dist);
            });

    m_ctl.create_kb_sensor_manifold(obj, "INC_STEREO_DIST", m_ctl.CT_SHOT,
            m_ctl.KEY_RIGHT_SQ_BRACKET, function(obj, id, pulse) {
                var dist = m_cam.get_stereo_distance(obj);
                m_cam.set_stereo_distance(obj, 1.1 * dist);
            });
}

});