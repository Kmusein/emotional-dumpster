import { StyleSheet, View } from 'react-native';
import TrashCanShape from './TrashCanShape';

export default function TrashCan({ paperCount = 0 }) {
  const visiblePapers = Math.min(Math.max(paperCount, 0), 6);

  return (
    <View style={styles.wrapper}>
      <View style={styles.canContainer}>
        <TrashCanShape width={240} height={190} />

        {visiblePapers > 0 && (
          <View style={styles.paperLayer}>
            {Array.from({ length: visiblePapers }).map((_, index) => (
              <View
                key={`paper-${index}`}
                style={[
                  styles.paper,
                  {
                    left: 48 + (index % 3) * 34 + Math.floor(index / 3) * 10,
                    bottom: 34 + Math.floor(index / 3) * 18,
                    transform: [{ rotate: `${(index % 5) * 7 - 10}deg` }],
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  canContainer: {
    width: 240,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paperLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  paper: {
    position: 'absolute',
    width: 34,
    height: 30,
    backgroundColor: '#BEBEBE',
    borderRadius: 14,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 9,
    opacity: 0.95,
  },
});
