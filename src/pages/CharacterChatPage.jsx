import { Navigate, useParams } from "react-router-dom";
import { KidChatSession } from "../components/KidCharacterChatSession";
import { getCharacterBySlug, isValidChatMode } from "../data/schoolCharacters";
import { useCharacterOpenRouterChat } from "../hooks/useCharacterOpenRouterChat";

export default function CharacterChatPage() {
  const { slug, mode } = useParams();
  const character = getCharacterBySlug(slug);

  if (!character) {
    return <Navigate to="/eco-friends" replace />;
  }
  if (!isValidChatMode(mode)) {
    return <Navigate to={`/characters/${character.slug}`} replace />;
  }
  if (mode === "video" && !character.videoCall) {
    return <Navigate to={`/characters/${character.slug}/chat/voice`} replace />;
  }

  return (
    <KidChatSession
      key={`${character.slug}-${mode}`}
      character={character}
      mode={mode}
      profilePath={`/characters/${character.slug}`}
      peerSubtitle="صديقك في النادي"
      useChatHook={useCharacterOpenRouterChat}
    />
  );
}
