import { App, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import updateGitRepo from "./gitScript";

interface MyPluginSettings {
	gitInformation: {
		userName: string;
		email: string;
		gitRepoPath: string;
	}
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	gitInformation: {
		userName: 'your git username',
		email: 'your git email',
		gitRepoPath: 'your git repo path'
	}
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async gitPush() {
		const resultMessage = await updateGitRepo(this.settings.gitInformation.gitRepoPath);
		new Notice(resultMessage, 3000)
	}

	async onload() {
		console.log('loading plugin');

		await this.loadSettings();

		this.addRibbonIcon('dice', 'update git repo', async() => {
			await this.gitPush();
		});

		this.addStatusBarItem().setText('Status Bar Text');

		this.addCommand({
			id: 'update git repo',
			name: 'Update Git Repository',
			checkCallback: (checking: boolean) => {
				if (!checking) {
					this.gitPush();
				}
			}
		});

		this.addSettingTab(new GitHotkeysSettingTab(this.app, this));

		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			console.log('codemirror', cm);
		});

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		console.log('unloading plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}

class GitHotkeysSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Your git account'});

		new Setting(containerEl)
			.setName('username')
			.setDesc('Your git username')
			.addText(text => text
				.setPlaceholder('username')
				.setValue(this.plugin.settings.gitInformation.userName??'')
				.onChange(async (value) => {
					this.plugin.settings.gitInformation.userName = value;
					await this.plugin.saveSettings();
				}));

			new Setting(containerEl)
			.setName('email')
			.setDesc('Your git email')
			.addText(text => text
				.setPlaceholder('email')
				.setValue(this.plugin.settings.gitInformation.email??'')
				.onChange(async (value) => {
					this.plugin.settings.gitInformation.email = value;
					await this.plugin.saveSettings();
				}));

			new Setting(containerEl)
			.setName('git repo path')
			.setDesc('Your git repository path in local computer')
			.addText(text => text
				.setPlaceholder('local path')
				.setValue(this.plugin.settings.gitInformation.gitRepoPath??'')
				.onChange(async (value) => {
					this.plugin.settings.gitInformation.gitRepoPath = value;
					await this.plugin.saveSettings();
				}));
	}
}

