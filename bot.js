const { Client, GatewayIntentBits } = require('discord.js');

// ضع هنا التوكن الخاص بالبوت
const TOKEN = 'MTMxMTc3OTI1NDE3Nzg5MDM1NQ.Go3SXV.10d2atAL-YfbD1wCIJ0f8Nui05jhMKqr_Pe6qA';

// اسم الرتبة المطلوبة للسماح باستخدام الأمر
const REQUIRED_ROLE_NAME = 'إشراف  +'; // قم بتغيير هذا إلى اسم الرتبة المطلوبة

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('!giverole') || message.author.bot) return;

  const args = message.content.trim().split(/\s+/);

  if (args.length < 4) {
    message.reply('Usage: !giverole @user @role duration_in_days');
    return;
  }

  const member = message.mentions.members.first();
  const role = message.mentions.roles.first();
  const durationInDays = parseInt(args[3]);

  // تحقق من أن المستخدم الذي ينفذ الأمر يملك الرتبة المطلوبة
  const authorHasRole = message.member.roles.cache.some(r => r.name === REQUIRED_ROLE_NAME);

  if (!authorHasRole) {
    message.reply(`لا يمكنك استخدام هذا الأمر. يجب أن تكون لديك رتبة ${REQUIRED_ROLE_NAME}.`);
    return;
  }

  if (!member) {
    message.reply('تأكد من الإشارة إلى المستخدم بشكل صحيح.');
    return;
  }

  if (!role) {
    message.reply('تأكد من الإشارة إلى الرتبة بشكل صحيح.');
    return;
  }

  if (isNaN(durationInDays) || durationInDays <= 0) {
    message.reply('تأكد من إدخال مدة صالحة بالأرقام (بالأيام).');
    return;
  }

  // تحويل الأيام إلى ميلي ثانية
  const durationInMilliseconds = durationInDays * 24 * 60 * 60 * 1000;

  try {
    await member.roles.add(role);
    message.reply(`تم إعطاء ${role.name} لـ ${member.displayName} لمدة ${durationInDays} يوم(أيام).`);

    setTimeout(async () => {
      await member.roles.remove(role);
      message.channel.send(`تمت إزالة ${role.name} من ${member.displayName}.`);
    }, durationInMilliseconds);
  } catch (error) {
    console.error(error);
    message.reply('حدث خطأ أثناء محاولة إضافة الرتبة. تأكد من أن البوت يمتلك الصلاحيات اللازمة.');
  }
});

client.login(TOKEN);
