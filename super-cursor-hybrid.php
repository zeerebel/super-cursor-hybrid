<?php
/**
 * Plugin Name:       Super Cursor Hybrid
 * Plugin URI:        https://github.com/zeerebel/super-cursor-hybrid
 * Description:       A WordPress plugin that replaces the default cursor with a dual GSAP-powered animation system.
 * Version:           3.8.0
 * Author:            Mark Phu
 * Author URI:        https://mongphu.com
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       super-cursor-hybrid
 * Requires at least: 5.8
 * Requires PHP:      7.4
 */

if (!defined('ABSPATH')) exit; // Exit if accessed directly.

// --- Settings Page ---

function super_cursor_add_admin_menu() {
    add_options_page(
        'Super Cursor Settings',
        'Super Cursor',
        'manage_options',
        'super-cursor',
        'super_cursor_settings_page'
    );
}
add_action('admin_menu', 'super_cursor_add_admin_menu');

function super_cursor_register_settings() {
    register_setting('super_cursor_options', 'super_cursor_enabled');
    register_setting('super_cursor_options', 'super_cursor_arrow_selectors');
    register_setting('super_cursor_options', 'super_cursor_arrow_overrides');
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
                <tr valign="top">
                    <th scope="row">Custom Selector(s) for Arrow Cursor</th>
                    <td>
                        <textarea name="super_cursor_arrow_selectors" rows="5" cols="60" class="large-text code"><?php echo esc_textarea(get_option('super_cursor_arrow_selectors', '')); ?></textarea>
                        <p class="description">Enter CSS selectors (one per line) that should show the default arrow cursor on hover.<br>Example: <code>.video-trigger, .shop-item</code></p>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">Custom Selector to Arrow Map</th>
                    <td>
                        <textarea name="super_cursor_arrow_overrides" rows="5" cols="60" class="large-text code"><?php echo esc_textarea(get_option('super_cursor_arrow_overrides', '')); ?></textarea>
                        <p class="description">Map selectors to custom arrow PNGs (one per line).<br>Format: <code>.shop-item : https://domain.com/cursor1.png</code></p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// --- Asset Loading ---

function super_cursor_enqueue_assets() {
    // Exit if disabled in settings or if user is on a mobile device.
    if (!get_option('super_cursor_enabled') || wp_is_mobile()) {
        return;
    }

    // Elementor and Admin safety check
    if (is_admin() || (isset($_GET['elementor-preview']))) {
        return;
    }

    $plugin_version = '3.8.0';
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
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
        [],
        '3.12.5',
        true
    );

    // Enqueue the main script
    wp_enqueue_script(
        'super-cursor-script',
        $plugin_url . 'assets/js/cursor-script.js',
        ['gsap'],
        $plugin_version,
        true
    );

    // Pass the image path and settings to JavaScript.
    wp_localize_script(
        'super-cursor-script',
        'pluginData',
        [
            'arrowImgPath'   => $plugin_url . 'assets/img/arrow-light.png',
            'arrowSelectors' => get_option('super_cursor_arrow_selectors', ''),
            'arrowOverrides' => get_option('super_cursor_arrow_overrides', ''),
        ]
    );
}
add_action('wp_enqueue_scripts', 'super_cursor_enqueue_assets');
