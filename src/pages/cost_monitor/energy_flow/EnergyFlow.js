import { dynamic } from 'umi';
import FlowChart from '../components/FlowChart';
import style from '../../index.less';
function EnergyFlow(){
    return (
        <div style={{ height:'100%' }}>
            <div className={style['left']}>
                <div className={style['card-container-wrapper']} style={{ height:'36%'}}>占位符</div>
                <div className={style['card-container-wrapper']} style={{ height:'64%'}}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>进线选择</div>
                        <div className={style['card-content']}>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className={style['right']}>
                <div className={style['card-container']}>
                    <FlowChart />
                </div>
            </div>

        </div>
    )
}

export default EnergyFlow;
