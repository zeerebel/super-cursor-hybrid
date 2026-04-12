<?php
/**
 * Plugin Name: Super Cursor Hybrid
 * Description: A WordPress plugin that replaces the default cursor with a dual GSAP-powered animation system.
 * Version: 3.7.9
 * Author: Mark Phu
 */

if (!defined('ABSPATH')) exit; // Exit if accessed directly.

// --- Settings Page (This part is unchanged as it works well) ---

function super_cursor_add_admin_menu() {
    add_options_page('Super Cursor Settings', 'Super Cursor', 'manage_options', 'super-cursor', 'super_cursor_settings_page');
}
add_action('admin_menu', 'super_cursor_add_admin_menu');

function super_cursor_register_settings() {
    register_setting('super_cursor_options', 'super_cursor_enabled');
}
add_action('admin_init', 'super_cursor_register_settings');

function super_cursor_settings_page() {
    ?>
    <div class="wrap">
        <h1>Super Cursor Settings</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('super_cursor_options');
            do_settings_sections('super_cursor_options');
            ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">Enable Custom Cursor</th>
                    <td><input type="checkbox" name="super_cursor_enabled" value="1" <?php checked(1, get_option('super_cursor_enabled'), true); ?> /></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// --- Asset Loading (This part is now corrected and improved) ---

function super_cursor_enqueue_assets() {
    // Exit if disabled in settings or if user is on a mobile device.
    if (!get_option('super_cursor_enabled') || wp_is_mobile()) {
        return;
    }
    
    // Elementor and Admin safety check
    if (is_admin() || (isset($_GET['elementor-preview']))) {
        return;
    }

    $plugin_version = '3.7.9';
    $plugin_url = plugin_dir_url(__FILE__);

    // Enqueue the stylesheet
    wp_enqueue_style(
        'super-cursor-style',
        $plugin_url . 'assets/css/cursor-style.css',
        [],
        $plugin_version
    );

    // Enqueue GSAP for high-performance animation
    wp_enqueue_script(
        'gsap',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
        [],
        '3.12.2',
        true
    );

    // Enqueue the main script
    wp_enqueue_script(
        'super-cursor-script',
        $plugin_url . 'assets/js/cursor-script.js',
        ['gsap'], // Depends on GSAP
        $plugin_version,
        true
    );

    // Pass the image path to our JavaScript file.
    wp_localize_script(
        'super-cursor-script',      // The script to attach data to
        'pluginData',               // The name of our JavaScript object
        [
            'arrowImgPath' => $plugin_url . 'assets/img/arrow-light.png'
        ]
    );
}
add_action('wp_enqueue_scripts', 'super_cursor_enqueue_assets');