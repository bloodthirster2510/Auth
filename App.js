import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SQLiteProvider,useSQLiteContext } from 'expo-sqlite';

//Initialize the database 
const intitializeDatabase = async(db)=>{
  try {
     await db.execAsync(`
      PRAGMA journal_mode=WAL;
      Create table if not exists users(
      id integer primary key autoincrement,
      username text unique,
      password text);`);
      console.log('Database inititialized !');
  }
  catch (error){
    console.log('Error while initializing the database :',error);
    
  }
}

const Stack = createStackNavigator();

function Login({ navigation }) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const db=useSQLiteContext(); 

  const handleLogin = async () => {
    if (user.length === 0 || password.length === 0) {
      Alert.alert('Attention!', 'Please enter both username and password');
      return;
    }
  
    try {
      console.log('Login Query: SELECT * FROM users WHERE username = ?', [user]);
      const GetUser = await db.getFirstAsync('SELECT * FROM users WHERE username = ?', [user]);
  
      if (!GetUser) {
        console.log('User not found:', user);
        Alert.alert('Error', 'Username does not exist');
        return;
      }
  
      console.log('Login Query with password: SELECT * FROM users WHERE username = ? AND password = ?', [user, password]);
      const validUser = await db.getFirstAsync(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [user, password]
      );
  
      if (validUser) {
        console.log('Login successful for user:', validUser);
        Alert.alert('Successful', 'Login successfully');
        navigation.navigate('home', { user: user });
        setUser('');
        setPassword('');
      } else {
        console.log('Invalid credentials for user:', user);
        Alert.alert('Error', 'Incorrect password or username');
      }
    } catch (error) {
      console.log('Error during login:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ĐĂNG NHẬP</Text>
      <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10, marginRight: 250 }}>
        Tên đăng nhập
      </Text>
      <TextInput style={styles.box} placeholder="id" onChangeText={setUser} value={user} />
      <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10, marginRight: 280 }}>
        Mật khẩu
      </Text>
      <TextInput style={styles.box} placeholder="password" onChangeText={setPassword} value={password} secureTextEntry   />
      <TouchableOpacity style={styles.boxButton} onPress={handleLogin}>
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Đăng nhập</Text>
      </TouchableOpacity>
      <Pressable style={{backgroundColor :'transparent'}} onPress={() => 
       navigation.navigate('register')
        }>
        <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'blue'}}>
          Đăng ký tại đây
        </Text>
      </Pressable>
    </View>
  );
}

function Register ({navigation}){
  const db = useSQLiteContext();
  const [user,setUser] = useState('');
  const [password,setPassword]= useState ('');
  //function to handle register
  const handleRegister = async () => {
    if (user.length === 0 || password.length === 0) {
      Alert.alert('Attention!', 'Please enter all the fields');
      return;
    }
  
    try {
      console.log('Check existing user: SELECT * FROM users WHERE username = ?', [user]);
      const existingUser = await db.getFirstAsync('SELECT * FROM users WHERE username = ?', [user]);
  
      if (existingUser) {
        console.log('User already exists:', user);
        Alert.alert('Error', 'Username already exists');
        return;
      }
  
      console.log('Inserting user:', { user, password });
      await db.runAsync('INSERT INTO users (username, password) VALUES (?, ?)', [user, password]);
      console.log('User registered successfully:', { user, password });
      Alert.alert('Success', 'Registration successful');
      navigation.navigate('home', { user: user });
    } catch (error) {
      console.log('Error during registration:', error);
    }
  };
  
  return (
    <View style = {styles.container}>
      <Text style = {{ fontSize :25,fontWeight :'bold',marginBottom :50}}>Đăng ký tài khoản</Text>
      <Text style = {{fontSize :12,fontWeight : 'bold',marginBottom :10,marginRight :250}}>Tên đăng nhập</Text>
    <TextInput style= {styles.box} placeholder ="user" onChangeText={setUser} value ={user}></TextInput>
    <Text style = {{fontSize :12,fontWeight : 'bold',marginBottom :10,marginRight :280}}>Mật khẩu</Text>
    <TextInput style = {styles.box} placeholder = "password"onChangeText={setPassword} value={password}></TextInput>
    <TouchableOpacity style = {styles.boxButton} onPress={handleRegister}>
    <Text style = {{fontSize :25,fontWeight :'bold'}}>Đăng ký</Text>
    </TouchableOpacity>

    </View>
  );
}
 function Home ({navigation,route}){
  const {user}=route.params;
  
  const handleLogout = () => {
    console.log(`User ${user} logged out`);
    navigation.reset({
      index: 0,
      routes: [{ name: 'login' }], // Quay lại màn hình Login
    });
  };

  return(
    <View style = {styles.container}>
      <Text>Welcome to home {user}!</Text>
      <Pressable style ={{}}  onPress={handleLogout}>
        <Text style ={{}}>Logout</Text>
      </Pressable>
    </View>
  )
 }


export default function App() {
  return (
    <SQLiteProvider databaseName='auth.db' onInit={intitializeDatabase}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false}}>
        <Stack.Screen name = "login" component={Login}/>
        <Stack.Screen name = "register" component={Register}/>
        <Stack.Screen name = "home" component={Home }/>
      </Stack.Navigator>
    </NavigationContainer>
    </SQLiteProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B3C8CF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title : {
    fontSize :30,
    fontWeight : 'bold',
    marginBottom :50,
  },
  box : {
    height :50,
    width : 350,
    borderRadius :15,
    elevation : 0.5,
    marginBottom :20,
    backgroundColor :'white',
    padding :10
  },
  boxButton : {
    height :80,
    width : 350,
    borderRadius :15,
    elevation : 0.5,
    marginBottom :20,
    backgroundColor :'#1F509A',
    justifyContent :'center',
    alignItems :'center',
    marginTop : 50
  },
  form :{

  }
});
