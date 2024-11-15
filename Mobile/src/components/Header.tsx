import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Header: React.FC<{ username: string; onLogout: () => void }> = ({ username, onLogout }) => {
    return (
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.username}>{username || 'Guest'}</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 100,
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    userInfo: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 18,
        color: 'white',
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    logoutButton: {
        padding: 10,
    },
    logoutText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Header;

