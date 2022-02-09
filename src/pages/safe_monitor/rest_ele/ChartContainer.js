import React from 'react';
import Loading from '@/pages/components/Loading';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import LineChart from '../components/LineChart';

function ChartContainer({ dispatch, data, isLoading }){
    return (
        <div style={{ height:'100%',position:'relative' }}>
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ position:'absolute', left:'14px', top:'14px', zIndex:'2' }}>
                <CustomDatePicker onDispatch={()=>{
                    dispatch({ type:'safeMonitor/fetchRestEle'});
                }} />
            </div>
            <LineChart xData={data.date} yData={data.energy} />
        </div>
    )
}

export default ChartContainer