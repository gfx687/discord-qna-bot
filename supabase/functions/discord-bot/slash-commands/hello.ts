import { CommandInteraction } from "../types/types.ts";
import { InteractionResponse, InteractionResponseType } from "../types/interaction-response-types.ts";

export function handleHelloCommand(interaction: CommandInteraction): InteractionResponse {
  const option = interaction.data.options.find(
    (option: { name: string; value: string }) => option.name === "name",
  );
  const content = `Hello, ${
    option!.value
  }! If you see this command then probably command you actually requested is not implemented yet.
user_id='${interaction.member.user.id}'
username='${interaction.member.user.username}'
global_name='${interaction.member.user.global_name}'
guild_id='${interaction.guild_id}'
channel_id='${interaction.channel_id}'`;

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: content },
  };
}
