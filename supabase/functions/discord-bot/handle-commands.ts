import { handleHelloCommand } from "./slash-commands/hello.ts";
import { handleStatusCommand } from "./slash-commands/status.ts";
import { Interaction, InteractionResponse } from "./types.ts";

export function handleCommands(interaction: Interaction): InteractionResponse {
    console.log(`Handling command: ${interaction.data.name}`)

    let result: InteractionResponse
    switch (interaction.data.name) {
        case 'status':
            result = handleStatusCommand(interaction)
            break
        default:
            result = handleHelloCommand(interaction)
            break
    }
    console.log(`Result: ${JSON.stringify(result)}`)
    return result
}