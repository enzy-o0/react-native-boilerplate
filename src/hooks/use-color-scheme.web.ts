import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 *
 * 하이드레이션 여부를 useSyncExternalStore의 서버/클라이언트 스냅샷 차이로 판정합니다.
 * useState + useEffect 조합은 effect 안에서 setState를 호출해 리렌더를 한 번 더 유발하며,
 * react-hooks/set-state-in-effect 규칙에 걸립니다.
 */

// 구독할 외부 상태가 없으므로 구독 해제 함수만 반환합니다.
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function useColorScheme() {
  const hasHydrated = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
