declare interface Module {
    hot?: Hot;
}
interface Hot {
    accept(callback: () => void): void;
}