import { Navigate, useParams } from "react-router-dom";
import { KidChatSession } from "../components/KidCharacterChatSession";
import { getMoyassinChatCharacter, isValidMoyassinChatSlug } from "../data/moyassinRoute";
import { isValidChatMode } from "../data/schoolCharacters";
import { useMoyassinOpenRouterChat } from "../hooks/useMoyassinOpenRouterChat";

export default function MoyassinChatPage() {
  const { slug, mode } = useParams();

  if (!isValidMoyassinChatSlug(slug)) {
    return <Navigate to="/moyassin" replace />;
  }
  const character = getMoyassinChatCharacter(slug);
  if (!character) {
    return <Navigate to="/moyassin" replace />;
  }
  if (!isValidChatMode(mode)) {
    return <Navigate to={`/moyassin/characters/${slug}`} replace />;
  }
  if (mode === "video" && !character.videoCall) {
    return <Navigate to={`/moyassin/characters/${slug}/chat/voice`} replace />;
  }

  return (
    <KidChatSession
      key={`${character.slug}-${mode}`}
      character={character}
      mode={mode}
      profilePath={`/moyassin/characters/${character.slug}`}
      peerSubtitle="شخصية مياثن"
      useChatHook={useMoyassinOpenRouterChat}
      scopeClassName="mys-chat-scope"
    />
  );
}
