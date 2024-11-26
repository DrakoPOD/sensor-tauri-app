// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use rand::prelude::*;
use std::time::{SystemTime, UNIX_EPOCH};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn random_data() -> [u64; 4] {
    let mut rng = rand::thread_rng();
    let time = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    [
        time,
        rng.gen_range(0..100),
        rng.gen_range(0..100),
        rng.gen_range(0..100),
    ]
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, random_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
