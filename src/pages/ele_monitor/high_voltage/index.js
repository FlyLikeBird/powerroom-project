import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:HighVoltage } = await import('./HighVoltage');
        return HighVoltage;
    }
})
