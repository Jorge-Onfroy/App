import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';

const musicas = [
    { id: '1', titulo: 'Glory', arquivo: require('../assets/sounds/Glory.mp3') },
    { id: '2', titulo: 'Suco_de_fruta', arquivo: require('../assets/sounds/Suco_de_fruta.mp3') },
    { id: '3', titulo: 'Wellerman', arquivo: require('../assets/sounds/Wellerman.mp3') },
];

export default function MusicScreen() {
  const [som, setSom] = useState(null);
  const [musicaAtualIndex, setMusicaAtualIndex] = useState(0); 
  const [estaTocando, setEstaTocando] = useState(false); 

  // Função para reproduzir ou pausar a música
  const reproduzirOuPausar = async () => {
    if (som) {
      if (estaTocando) {
        await som.pauseAsync(); 
        setEstaTocando(false);  
        await som.playAsync();  
        setEstaTocando(true);   // ARQBT*
      }
    }
  };


  const tocarMusica = async (index) => {
    if (som) {
      await som.unloadAsync();  //liimpa a música anterior
    }

    const musica = musicas[index];
    const { sound } = await Audio.Sound.createAsync(musica.arquivo);
    setSom(sound);
    setMusicaAtualIndex(index);
    setEstaTocando(true);  
    await sound.playAsync();

   
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setEstaTocando(false); 
      }
    });
  };


  const proximaMusica = () => {
    const proximoIndex = (musicaAtualIndex + 1) % musicas.length; 
    tocarMusica(proximoIndex);
  };


  const musicaAnterior = () => {
    const anteriorIndex = (musicaAtualIndex - 1 + musicas.length) % musicas.length; 
    tocarMusica(anteriorIndex);
  };


  useEffect(() => {
    return som ? () => som.unloadAsync() : undefined;
  }, [som]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Músicas</Text>

      {/* Lista de músicas */}
      <FlatList
        data={musicas}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.musica}
            onPress={() => tocarMusica(index)} 
          >
            <Text style={styles.nomeMusica}>{item.titulo}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Controles de reprodução */}
      {musicaAtualIndex !== null && (
        <View style={styles.controles}>
          <Text style={styles.nomeMusicaAtual}>Tocando: {musicas[musicaAtualIndex].titulo}</Text>
          <View style={styles.botaoContainer}>
            <Button title="Anterior" onPress={musicaAnterior} />
            <Button title={estaTocando ? 'Pausar' : 'Reproduzir'} onPress={reproduzirOuPausar} />
            <Button title="Próxima" onPress={proximaMusica} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  musica: {
    padding: 15,
    backgroundColor: '#1e1e1e', 
    borderRadius: 5,
    marginBottom: 10,
  },
  nomeMusica: {
    fontSize: 18,
    color: '#fff', 
  },
  controles: {
    marginTop: 20,
    alignItems: 'center',
  },
  nomeMusicaAtual: {
    fontSize: 18,
    color: '#fff', 
    marginBottom: 10,
  },
  botaoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
});
