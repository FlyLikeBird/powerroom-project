import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:EleReport } = await import('./EleReport');
        return EleReport;
    }
})
