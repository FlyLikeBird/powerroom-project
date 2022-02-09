import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:ExtremeReport } = await import('./ExtremeReport');
        return ExtremeReport;
    }
})
