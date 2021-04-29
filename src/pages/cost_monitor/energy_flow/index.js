import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:EnergyFlow } = await import('./EnergyFlow');
        return EnergyFlow;
    }
})
