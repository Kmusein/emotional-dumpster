@AGENTS.md

# 감정쓰레기통 (Emotional Dumpster)

## 앱 컨셉
감정을 글로 쓰고 버리면 내용이 완전히 삭제되는 앱. 버리기 전후 감정 이모지만 캘린더에 기록된다.

## 기술 스택
- React Native + Expo (v56)
- Supabase (백엔드/DB)
- Google OAuth (로그인)
- Vercel 배포: emotional-dumpster.vercel.app

## 디자인 시스템
| 용도 | 값 |
|------|-----|
| 배경색 | `#2F2F2F` |
| 텍스트 | `#FFFFFF` |
| 버튼 (민트) | `#6B9E8F` |
| 카드 배경 | `#3D3D3D` |

## 화면 흐름
```
Home
└─ 캘린더 (Home에서 진입)
└─ EmotionSelect  → 부정 감정 12개 선택
   └─ Write        → 글 작성
      └─ Animation → 구기기 → 던지기 애니메이션
         └─ PositiveEmotion → 긍정 감정 10개 선택
            └─ Complete
               └─ Home
```

## 구현 현황
- 9개 화면 모두 구현 완료
- Vercel 배포 완료
