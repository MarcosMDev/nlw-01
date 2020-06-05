import React, { useState, useEffect, ChangeEvent } from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import { View, Image, Text, ImageBackground, TextInput, Alert } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

import axios from 'axios'

import RNPickerSelect from 'react-native-picker-select';

import styles from './styles'

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

interface FormatPickerSelect {
  label: string;
  value: string;
}

const Home = () => {
    const [selectedUf, setSelectedUf] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')
    const [ufs, setUfs] = useState<FormatPickerSelect[]>([])
    const [cities, setCities] = useState<FormatPickerSelect[]>([])

    
  useEffect(() => {
    async function loadUfs() {
      const response = await axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados');

      const ufInitials = response.data.map(uf => {
        return {
          label: uf.sigla,
          value: uf.sigla,
        };
      });

      setUfs(ufInitials);
    }
    loadUfs();
  }, []);

  useEffect(() => {
    async function loadCities() {
      if (selectedUf === '0') return;

      const response = await axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`);

      const cityNames = response.data.map(city => {
        return {
          label: city.nome,
          value: city.nome,
        };
      });

      setCities(cityNames);
    }
    loadCities();
  }, [selectedUf]);

  function handleNavigateToPoints() {
    if (selectedUf === '0' || selectedCity === '0') {
      Alert.alert('Ooops...', 'Precisamos que selecione a uf e a cidade.');
    }
    else {
      console.log(selectedUf, selectedCity)
      navigation.navigate('Points', { uf: selectedUf, city: selectedCity });
    }
  }

    const navigation = useNavigation()
    return (
        <ImageBackground 
          source={require('../../assets/home-background.png')} 
          style={styles.container}
          imageStyle={{ width: 274, height: 368 }}
        >
            <View style={styles.main}>
              <Image source={require('../../assets/logo.png')} />
              <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
              <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
            </View>

          <View style={styles.footer}>
            {ufs.length > 0 && (
              <RNPickerSelect
                placeholder={{
                  label: 'Selecione uma UF',
                  value: '0',
                }}
                // style={{ ...pickerSelectStyles }}
                onValueChange={(value) => {
                  setSelectedUf(String(value));
                  setSelectedCity('0');
                }}
                items={ufs}
              />
            )}

            {selectedUf !== '0' && (
              <RNPickerSelect
                placeholder={{
                  label: 'Selecione uma cidade',
                  value: '0',
                }}
                // style={{ ...pickerSelectStyles }}
                onValueChange={(value) => {
                  setSelectedCity(String(value))
                }}
                items={cities}
              />
            )} 
              <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                <View style={styles.buttonIcon}>
                  <Text>
                    <Icon name="arrow-right" color="#FFF" size={24} />
                  </Text>
                </View>

                <Text style={styles.buttonText}>
                  Entrar
                </Text>
              </RectButton>
            </View>
        </ImageBackground>
    )
}

export default Home