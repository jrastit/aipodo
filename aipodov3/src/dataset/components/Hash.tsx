const Hash = (props : {
    hash : string | undefined
}) => {

    if (props.hash === undefined) {
        return (
            <>
            
            </>
        );
    }

    if (props.hash.length > 7) {
        if (props.hash.substring(0, 7) == '0000000'){
            return (
                <>
                { parseInt(props.hash) }
                </>
            );
        }
        return (
            <>
            { props.hash.substring(0, 7) }
            </>
        );
    }

    return (
        <>
        { props.hash }
        </>
    );
    };

export default Hash