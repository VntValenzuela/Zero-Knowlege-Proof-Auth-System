<?php
/**
 * Plugin Name:       Zero Auth Web
 * Description:       A Zero auth web for Wordpress.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            vincent
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       zeroauth
 */

add_action( 'admin_menu', 'zeroauth_init_menu' );

/**
 * Init Admin Menu.
 *
 * @return void
 */
function zeroauth_init_menu() {
    add_menu_page( __( 'Zero Auth', 'zeroauth'), __( 'Zero Auth', 'zeroauth'), 'manage_options', 'zeroauth', 'zeroauth_admin_page', 'dashicons-admin-post', '2.1' );
}

/**
 * Init Admin Page.
 *
 * @return void
 */
function zeroauth_admin_page() {
    require_once plugin_dir_path( __FILE__ ) . 'templates/app.php';
}

add_action( 'admin_enqueue_scripts', 'zeroauth_admin_enqueue_scripts' );

/**
 * Enqueue scripts and styles.
 *
 * @return void
 */
function zeroauth_admin_enqueue_scripts() {
    wp_enqueue_style( 'zeroauth-style', plugin_dir_url( __FILE__ ) . 'build/index.css' );
    wp_enqueue_script( 'zeroauth-script', plugin_dir_url( __FILE__ ) . 'build/index.js', array( 'wp-element' ), '1.0.0', true );
}
