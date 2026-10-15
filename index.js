
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  Events
} = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error('Configure DISCORD_TOKEN, CLIENT_ID e GUILD_ID.');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Verifica se o bot está online.'),

  new SlashCommandBuilder()
    .setName('sobre')
    .setDescription('Informações sobre o bot.')
].map(command => command.toJSON());

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );

  console.log('Comandos registrados!');
}

client.once(Events.ClientReady, async readyClient => {
  console.log(`Bot online: ${readyClient.user.tag}`);

  try {
    await registerCommands();
  } catch (error) {
    console.error('Erro ao registrar comandos:', error);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply({
      content: `🏓 Pong! ${client.ws.ping} ms`,
      ephemeral: true
    });
  }

  if (interaction.commandName === 'sobre') {
    const embed = new EmbedBuilder()
      .setColor(0xE53935)
      .setTitle('🔥 FURIA APOSTAS')
      .setDescription(
        'Bot oficial da comunidade FURIA.\n\n' +
        '🎫 Tickets: em desenvolvimento.\n' +
        '🛡️ Moderação: em desenvolvimento.\n' +
        '🎮 Filas amistosas: em desenvolvimento.'
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
});

client.login(TOKEN).catch(error => {
  console.error('Erro ao conectar o bot:', error);
});
