import '../styles/404.scss';
import ModeController from './ModeController';

const modeController = new ModeController();

modeController.systemModeHandler();
modeController.storageModeHandler();

console.log('From 404');
