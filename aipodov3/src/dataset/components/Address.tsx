import {Button, OverlayTrigger, Popover} from 'react-bootstrap'
import {Clipboard} from 'react-bootstrap-icons'
const clipboard = (text : string) => {
    navigator.clipboard.writeText(text)
  }

const Address = (props : {
    address : string | undefined
}) => {

    if (props.address === undefined) {
        return (
            <>
            
            </>
        );
    }

    if (props.address.length > 10) {
        
        return (
            <OverlayTrigger
        placement="bottom"
        trigger={["hover","focus"]}
        overlay={(
          <Popover>
            <Popover.Body>
                <p>{props.address}</p>
            </Popover.Body>
          </Popover>
        )}>
        <span id='address-widget'>
            <>
            { props.address.substring(0, 6) }...{ props.address.substring(props.address.length - 4) }
            </>&nbsp;
          <Button
            style={{padding:0,lineHeight:'1em'}}
            size='sm'
            variant='default'
            onClick={() => clipboard(props.address || '')}
          ><Clipboard/></Button>
        </span>
      </OverlayTrigger>
            
        );
    }

    return (
        <>
        { props.address }
        </>
    );
    };

export default Address