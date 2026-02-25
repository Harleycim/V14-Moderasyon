# V14 Moderasyon

Gelişmiş **Discord Moderasyon + Kayıt + Eğlence** bot altyapısı.

Bu proje **discord.js v14** ve **MongoDB (mongoose)** kullanır.

## Özellikler

- **Ceza ID (Case) sistemi**
- **MongoDB kayıt sistemi**
- **Log embed sistemi** (+ hata log kanalı)
- **Yetki seviye sistemi** (`USER/STAFF/MOD/ADMIN/OWNER`)
- **Cooldown sistemi** (komut bazlı)
- **Komut kategori sistemi**
- **Otomatik komut yükleyici** (modül bazlı)
- **Butonlu onay akışları** (ban/kick/clear/mute/jail vb.)
- **Select menu desteği** (örn. mute preset seçimleri)
- **Prefix komut sistemi** (varsayılan prefix: `.`)
- **Bakım modu** + **Karaliste**

## Proje Yapısı

`src/modules/**` altında modül bazlı ilerler:

- `modules/moderation`
- `modules/register`
- `modules/entertainment`
- `modules/logging`
- `modules/admin`

Komut/etkileşim dosyaları şuralardan otomatik yüklenir:

- Slash komutlar: `src/modules/**/commands/*.js`
- Button handler: `src/modules/**/buttons/*.js`
- Select handler: `src/modules/**/selects/*.js`
- Prefix komutlar: `src/modules/**/prefix/*.js`

## Kurulum

1. Node.js 18+ önerilir.
2. `src/config/bot.config.js` dosyasını doldur.
3. Bağımlılıkları kur:

```bash
npm i
```

4. Botu çalıştır:

```bash
npm start
```

## Konfigürasyon

`src/config/bot.config.js` içinden yönetilir (**.env yok**):

- `token`: Bot token
- `clientId`: Discord uygulama (Application) ID
- `guildId`: Komutların basılacağı sunucu ID (guild register)
- `mongoUri`: MongoDB connection string
- `ownerIds`: Owner ID listesi (`['123', '456']`)
- `prefix`: Prefix komutlar için prefix (varsayılan `.`)

Notlar:

- Slash komutlar **bot açılınca otomatik** guild'a register edilir.
- `mongoUri` boşsa bot MongoDB bağlantısını atlar (bazı özellikler çalışmaz).

## Komutlar (Örnekler)

### Moderasyon

- `/ban` (buton onaylı)
- `/unban`
- `/kick` (buton onaylı)
- `/clear` (buton onaylı)
- `/warn`, `/warnings`, `/unwarn`
- `/mute` (select preset + Chat/Voice butonları)
- `/unmute`
- `/jail-ayar`, `/jail` (buton onaylı), `/unjail` (roller geri yüklenir)

### Kayıt

- `/kayit-ayar`
- `/kayit` (isim + yaş -> Erkek/Kadın buton)
- `/erkek`, `/kadin`, `/kayitsiz`
- `/isim-degistir`
- `/kayit-istatistik`

### Sistem / Logging

- `/log-ayarla` (log kanalı + hata log kanalı)
- `/say`

### Admin

- `/bakim` (owner)
- `/karaliste` (owner)

### Eğlence

- `/zar`
- `/coinflip`
- `/eightball`
- `/avatar`
- `/espri`

### Prefix (.)

- `.ping`

## Log Ayarları

Logları açmak için:

1. `/log-ayarla log:#kanal hata:#kanal`
2. Moderasyon işlemleri log kanalına embed olarak gider.

## Yetki Seviyeleri

Yetki kontrolü iki katmanlıdır:

- Discord permission (örn. `BanMembers`, `ManageMessages`)
- Bot içi level (örn. `MOD`, `ADMIN`)

Owner'lar `bot.config.js -> ownerIds` ile belirlenir.

## Güvenlik

- Token'ını paylaşma.
- `ownerIds` alanını sadece sana ait ID'lerle doldur.
- `/eval` gibi tehlikeli komutlar bu altyapıda varsayılan olarak ekli değildir.

## Lisans

MIT License. Detaylar için `LICENSE` dosyasına bak.
