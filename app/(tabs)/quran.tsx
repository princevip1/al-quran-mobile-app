import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card } from '../../src/components/Card';
import { Text } from '../../src/components/Text';
import quranData from '../../src/data/quran_tafsir.json';
import { useTheme } from '../../src/hooks/useTheme';

export default function QuranScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSurahs = quranData.surahs.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.banglaName.includes(searchQuery) ||
      surah.number.toString().includes(searchQuery)
  );

  const renderSurahItem = ({ item }: any) => (
    <Card
      variant="elevated"
      padding="lg"
      onPress={() => {}}
      style={styles.surahCard}
    >
      <View style={styles.surahHeader}>
        <View
          style={[
            styles.surahNumber,
            {
              backgroundColor: theme.colors.primary,
            },
          ]}
        >
          <Text variant="body" color="#FFFFFF" weight="bold">
            {item.number}
          </Text>
        </View>
        <View style={styles.surahInfo}>
          <Text variant="h5">{item.englishName}</Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            {item.englishNameTranslation} • {item.numberOfAyahs} {t('quran.verses')}
          </Text>
        </View>
        <View style={styles.surahMeta}>
          <Text variant="arabic" style={styles.arabicName}>
            {item.name}
          </Text>
          <View
            style={[
              styles.revelationBadge,
              {
                backgroundColor:
                  item.revelationType === 'Meccan'
                    ? theme.colors.primary + '20'
                    : theme.colors.secondary + '20',
              },
            ]}
          >
            <Text
              variant="caption"
              color={
                item.revelationType === 'Meccan'
                  ? theme.colors.primary
                  : theme.colors.secondary
              }
              weight="medium"
            >
              {t(`quran.${item.revelationType.toLowerCase()}`)}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text variant="h3" color="#FFFFFF">
          {t('quran.allSurahs')}
        </Text>
        <View style={[styles.searchBar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Ionicons name="search" size={20} color="rgba(255,255,255,0.8)" />
          <TextInput
            style={[styles.searchInput, { color: '#FFFFFF' }]}
            placeholder={t('quran.searchPlaceholder')}
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredSurahs}
        renderItem={renderSurahItem}
        keyExtractor={(item) => item.number.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  surahCard: {
    marginBottom: 12,
  },
  surahHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  surahNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahInfo: {
    flex: 1,
    gap: 4,
  },
  surahMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  arabicName: {
    fontSize: 20,
  },
  revelationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
