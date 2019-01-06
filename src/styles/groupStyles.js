import { StyleSheet } from 'react-native';

const groupStyles = StyleSheet.create({
    container: {
        margin: 8,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black'
    },
    subtitle: {
        fontSize: 20, 
        fontWeight: 'bold', 
        color: 'black',
        marginBottom: 15
    },
    overviewColor: {
        width: 20,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    memberCountContainer: {
        alignItems: 'center', 
        justifyContent: 'center', 
        marginLeft: 10
    },
    memberCount: {
        fontSize: 15, 
        color: 'lightgrey'
    },
    inputField: {
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: 'white',
        borderRadius: 10,
        height: 40,
        marginBottom: 20
    },
    greyBottomBorder: {
        borderBottomWidth: 1, 
        borderBottomColor: 'lightgrey', 
        paddingBottom: 20, 
        marginBottom: 20
    }
});

export default groupStyles;