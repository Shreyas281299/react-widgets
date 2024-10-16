import {
  ButtonCircle,
  Flex,
  IconNext,
  Text,
} from '@momentum-ui/react-collaboration';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrubbingBar } from './ScrubbingBar';
import './VoicemailItem.styles.scss';
import './VoicemailPlaybackControls.styles.scss';
import { useAudio } from './hooks/useAudio';
import useWebexClasses from './hooks/useWebexClasses';
import { formatDuration } from './utils/dateUtils';

export interface IVoicemailPlaybackControlsProps {
  audioSrc: string;
  onPlay?: () => void;
  className?: string;
  duration: number;
  audioSrcLoader?: boolean;
  focusPauseButton?: () => void;
  setIsAnnouncePlayOrPause: React.Dispatch<React.SetStateAction<boolean>>;
  voicemailName?: string;
  playButtonRef: React.RefObject<HTMLButtonElement>;
  pauseButtonRef: React.RefObject<HTMLButtonElement>;
  audioButtonRef: React.RefObject<HTMLButtonElement>;
  trackRef: React.RefObject<HTMLDivElement>;
}

export const VoicemailPlaybackControls = ({
  audioSrc,
  onPlay = () => { },
  className = undefined,
  duration,
  audioSrcLoader = false,
  setIsAnnouncePlayOrPause,
  voicemailName,
  playButtonRef,
  pauseButtonRef,
  audioButtonRef,
  trackRef
}: IVoicemailPlaybackControlsProps) => {
  const { t } = useTranslation('WebexVoicemail');
  const { curTime, playing, setPlaying, setClickedTime } =
    useAudio(audioSrc, audioSrcLoader);
  const playAudio = () => {
    onPlay();
    setPlaying(true);
  };
  const [cssClasses, sc] = useWebexClasses('voicemail-playback-controls');

  useEffect(() => {
    if (pauseButtonRef.current) {
      pauseButtonRef?.current?.focus();
    }
  }, [playing, audioSrcLoader, audioSrc]);

  useEffect(() => {
    if (playing && audioSrc) {
      setIsAnnouncePlayOrPause(true);
    } else {
      setIsAnnouncePlayOrPause(false);
    }
  }, [playing, audioSrc, setIsAnnouncePlayOrPause]);

  return (
    <Flex xgap=".5rem" alignItems="center" className={`${className} ${cssClasses}`}>
      {playing && audioSrc ? (
        <ButtonCircle
          outline
          size={28}
          onPress={() => {
            setPlaying(false);
          }}
          data-testid="pause-button"
          title={t('pauseVoicemail')}
          ref={pauseButtonRef}
          aria-label= {t('pauseVoicemail')}
        >
          <IconNext name="pause" autoScale={150} />
        </ButtonCircle>
      ) : (
        <ButtonCircle
        outline
        size={28}
        onPress={playAudio}
        data-testid="play-button"
        title={t('playVoicemail')}
        ref={playButtonRef}
        aria-label= {t('playVoicemail')}
      >
          { (audioSrcLoader && audioSrc === '') ? (
             <div className='vmLoader'><div className="md-loading-spinner-wrapper" data-testid="loading-icon">
             <div className="md-icon-wrapper">
               <svg xmlns="http://www.w3.org/2000/svg"
                 width="100%" height="100%" data-test="spinner" fill="currentColor" viewBox="0, 0, 32, 32" data-scale="28" data-autoscale="false">
                 <path d="M16 2.25A13.75 13.75 0 1 0 29.75 16 13.765 13.765 0 0 0 16 2.25Zm0 26A12.25 12.25 0 1 1 28.25 16 12.263 12.263 0 0 1 16 28.25Z">
                 </path>
               </svg>
             </div>
             <div className="md-icon-wrapper md-loading-spinner-arch">
               <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" data-test="spinner-partial" fill="currentColor" viewBox="0, 0, 32, 32" data-scale="28" data-autoscale="false">
                 <path d="M15.25 3a.75.75 0 0 0 .75.75A12.264 12.264 0 0 1 28.25 16a.75.75 0 1 0 1.5 0A13.765 13.765 0 0 0 16 2.25a.75.75 0 0 0-.75.75Z">
                 </path>
               </svg>
             </div>
           </div>
           </div>
          ) : (
            <IconNext name="play" autoScale={150} className={sc('play-icon')} />
          )}
        </ButtonCircle>
      )}

      <Text className={sc('current-time')}>{formatDuration(curTime)}</Text>
      <ScrubbingBar
        maxValue={duration / 1000}
        value={[curTime]}
        onChange={([value]) => setClickedTime(value)}
        step={Math.min(duration / 1000, 0.1)}
        voicemailName={voicemailName}
        duration={duration}
        playButtonRef={playButtonRef}
        pauseButtonRef={pauseButtonRef}
        audioButtonRef={audioButtonRef}
        trackRef={trackRef}
      />
      <Text data-testid="total-duration">{formatDuration(duration / 1000)}</Text>
    </Flex>
  );
};