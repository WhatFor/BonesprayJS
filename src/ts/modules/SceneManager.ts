import { ISceneManager, IScene, MidiNote } from "../types/midi";

export default class SceneManager implements ISceneManager {

    private scenes: IScene[] = [];

    private activeSceneId: number = 0;

    private activeScene = () =>
        this.scenes.find(x => x.id == this.activeSceneId);

    registerScenes(addingScenes: IScene[]): void {

        if (addingScenes.some(x => x.id === undefined)) {
            throw new Error("All scenes must have an ID.");
        }

        if (this.scenes.some(s => s.id == addingScenes.find(x => x.id)?.id)) {
            throw new Error("Scene already registered.");
        }

        addingScenes.forEach(x => this.scenes.push(x));
    }

    getScenes(): IScene[] {
        return this.scenes;
    }

    getActiveScene(): IScene | undefined {
        return this.scenes.find(x => x.id == this.activeSceneId);
    }

    activateScene(id: number): void {

        if (this.scenes.find(x => x.id === id) == undefined) {
            throw new Error("Scene not found.");
        }

        this.activeSceneId = id;
        this.activeScene()?.start();
    }

    pushNote(note: MidiNote): void {
        this.activeScene()?.processNote(note);
    }

}