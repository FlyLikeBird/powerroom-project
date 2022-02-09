import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:CameraMonitor } = await import('./CameraMonitor');
        return CameraMonitor;
    }
})
