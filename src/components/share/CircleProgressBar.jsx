import React from 'react'
import { Flat } from '@alptugidin/react-circular-progress-bar';


function SemiCircleProgressBar({ value }) {

    let value_int = (value / 5) * 100
    return (

      <>
        <Flat
          progress={value_int}
          text={value}
          showValue={ false }
          showMiniCircle={ false }
          revertBackground={true}
          sx={{
            strokeColor: '#1eff00',
            bgStrokeColor: '#564848',
            barWidth: 10,
            bgColor: { value: '#f5eaea', transparency: '20'},
            shape: 'half',
            textSize: 20,
            textWeight: 'bold',
            miniCircleColor: '#6600ff'
          }}
        />
        <div style={{ fontSize: 24, marginTop: -90, textAlign:'center' }}>
           {/* <strong style={{display: 'block'}}>{value}</strong> */}
           <strong style={{display: 'block'}}>Comulative CGPA</strong>
          {/* <small style={{fontSize: 12}}>Cumulative CGPA</small> */}
        </div>
      </>
     
        // <Flat
        //     value={value_int}
        //     circleRatio={0.6}
        //     strokeWidth={12}
        //     styles={{
        //         root: {
        //             transform: "rotate(-108deg)",
        //         },
        //         path: { stroke: "#7D52E9", strokeLinecap: "round", strokeWidth: 12 },
        //         trail: { stroke: "rgba(128,128,200, 0.4)", strokeLinecap: "round",},
        //     }}
        // >
        //     <div style={{ fontSize: 24, marginTop: -30, textAlign:'center' }}>
        //         <strong style={{display: 'block'}}>{value}</strong>
        //         <small style={{fontSize: 12}}>Cumulative CGPA</small>
        //     </div>
        // </Flat>
    )
}

export default SemiCircleProgressBar