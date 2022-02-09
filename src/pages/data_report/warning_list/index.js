import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:WarningListManager } = await import('./WarningListManager');
        return WarningListManager;
    }
})
