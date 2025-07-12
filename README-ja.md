[English](https://github.com/masatoko/godot-uid-sync/blob/main/README.md) | [日本語](https://github.com/masatoko/godot-uid-sync/blob/main/README-ja.md)

# Godot UID Sync（日本語版）

**Godot UID Sync** は、Godot のリソースファイル（例：`.tscn`、`.gd`、`.cs`、`.gdshader` など）をリネームまたは移動した際に、対応する `.uid` ファイルを自動的に同期する Visual Studio Code 拡張機能です。これにより、Godot プロジェクトでの参照の破損を防ぎ、`.uid` ファイルとアセットの整合性を保ちます。

![Automatic UID Sync on Rename](images/uid-auto-sync.png)

## 主な機能

* Godot リソースファイルと一緒に `.uid` ファイルを自動的にリネームまたは移動します。
* `project.godot` ファイルが存在する場合のみアクティブになるように設定可能。
* 特定のファイルタイプを同期から除外可能。
* `.uid` や `.meta` など、連動させる拡張子をカスタマイズ可能。
* ログ出力の詳細度や表示タイミングを設定可能。

## 推奨設定

ファイルエクスプローラーの煩雑さを避けるため、VS Code の `settings.json` に以下を追加して `.uid` ファイルを非表示にすることを推奨します：

```json
"files.exclude": {
  "**/*.uid": true
}
```

## 推奨: ログの確認

ファイルをリネームした際は、`.uid` ファイル（およびその他のリンクされた拡張子）が正しくリネームされたかどうかを確認するために、**出力タブ**を確認することを推奨します。  
出力に何も表示されない場合は、UID のリネームが行われなかった可能性があります。

## 拡張機能の設定

この拡張機能には以下の設定オプションがあります：

- **`godotUidSync.enabledOnlyInGodotProjects`**（boolean、デフォルト: `false`）  
  ワークスペースに `project.godot` ファイルが存在する場合のみ拡張機能を有効にします。※ウィンドウの再読み込みが必要です。

- **`godotUidSync.excludeExtensions`**（string[]、デフォルト: `[]`）  
  .uid ファイルと連動してリネーム・移動を監視する対象から**除外する**ファイル拡張子のリスト（例: `.png`）。ドットを含む。

- **`godotUidSync.linkedExtensions`**（string[]、デフォルト: `[".uid"]`）  
  Godotリソースと一緒にリネーム・移動される拡張子のリスト（例: `.uid`, `.meta` など）。ドットを含む。

- **`godotUidSync.revealOutputOnInfo`**（boolean、デフォルト: `true`）  
  情報メッセージが出力されたときに出力パネルを自動的に表示します。無効にしてもログは記録されます。

- **`godotUidSync.revealOutputOnWarn`**（boolean、デフォルト: `true`）  
  警告メッセージが出力されたときに出力パネルを自動的に表示します。無効にしてもログは記録されます。

- **`godotUidSync.revealOutputOnError`**（boolean、デフォルト: `true`）  
  エラーメッセージが出力されたときに出力パネルを自動的に表示します。無効にしてもログは記録されます。

- **`godotUidSync.showVerbose`**（boolean、デフォルト: `true`）  
  詳細なヒントや内部ログを出力パネルに表示します。拡張機能の挙動が理解できたらオフにするのがおすすめです。
