export const LANGS = { tr: 'Türkçe', az: 'Azərbaycanca', ru: 'Русский' }
export const LOCALES = { tr: 'tr-TR', az: 'az-AZ', ru: 'ru-RU' }
export const CURS = { TRY: '₺', AZN: '₼', RUB: '₽', USD: '$', EUR: '€' }
const D = {
  tr: { hello: 'Merhaba', left: 'Kalan bütçe', spent: 'Harcanan', budget: 'Bütçe', quick: 'Hızlı Ekle', new: '+ Yeni', hint: 'Silmek için butona basılı tut / sağ tıkla.',
    home: 'Ana Sayfa', exp: 'Harcama', loan: 'Kredi', sum: 'Özet', prof: 'Profil', expT: 'Harcamalar', noExp: 'Bu ay harcama yok.', addExp: '+ Harcama ekle',
    name: 'Ad', price: 'Fiyat', amount: 'Tutar', save: 'Kaydet', cancel: 'İptal', loansT: 'Krediler', monthly: 'Aylık', debt: 'Kalan borç', day: 'Her ayın {d}. günü',
    paidOf: '{a}/{b} taksit ödendi', pay: 'Ödedim', done: '✅ Bitti', noLoan: 'Henüz kredi eklemedin.', addLoan: '+ Kredi ekle', loanName: 'Kredi adı', inst: 'Aylık taksit',
    total: 'Toplam taksit sayısı', payDay: 'Ödeme günü (1-31)', sumT: 'Aylık Özet', top: 'En çok harcanan', byCat: 'Kategoriye göre', noData: 'Veri yok.',
    profT: 'Profil', email: 'E-posta', mBudget: 'Aylık bütçe', edit: 'Düzenle', logout: 'Çıkış yap', settings: 'Ayarlar', lang: 'Dil', theme: 'Görünüm', system: 'Sistem', light: 'Açık', dark: 'Koyu',
    cur: 'Para birimi', curNote: 'Sadece gösterim için; tutarlar çevrilmez.', login: 'Giriş yap', signup: 'Kayıt ol', pw: 'Şifre', signupOk: 'Kayıt tamam. E-posta doğrulaması açıksa mailini kontrol et.',
    confirm: 'Onayla', qty: 'Adet', unit: 'Birim fiyat', totalL: 'Toplam', emoji: 'Emoji', newBtn: 'Yeni buton', delQ: 'silinsin mi?', manual: 'Harcama', newLoan: 'Yeni kredi', defName: 'Kullanıcı' },
  az: { hello: 'Salam', left: 'Qalan büdcə', spent: 'Xərclənən', budget: 'Büdcə', quick: 'Sürətli əlavə', new: '+ Yeni', hint: 'Silmək üçün düyməni basılı saxla / sağ klik et.',
    home: 'Ana səhifə', exp: 'Xərclər', loan: 'Kredit', sum: 'Xülasə', prof: 'Profil', expT: 'Xərclər', noExp: 'Bu ay xərc yoxdur.', addExp: '+ Xərc əlavə et',
    name: 'Ad', price: 'Qiymət', amount: 'Məbləğ', save: 'Yadda saxla', cancel: 'Ləğv et', loansT: 'Kreditlər', monthly: 'Aylıq', debt: 'Qalan borc', day: 'Hər ayın {d}-i',
    paidOf: '{a}/{b} taksit ödənib', pay: 'Ödədim', done: '✅ Bitdi', noLoan: 'Hələ kredit əlavə etməmisən.', addLoan: '+ Kredit əlavə et', loanName: 'Kredit adı', inst: 'Aylıq taksit',
    total: 'Ümumi taksit sayı', payDay: 'Ödəniş günü (1-31)', sumT: 'Aylıq xülasə', top: 'Ən çox xərclənən', byCat: 'Kateqoriya üzrə', noData: 'Məlumat yoxdur.',
    profT: 'Profil', email: 'E-poçt', mBudget: 'Aylıq büdcə', edit: 'Redaktə et', logout: 'Çıxış', settings: 'Ayarlar', lang: 'Dil', theme: 'Görünüş', system: 'Sistem', light: 'İşıqlı', dark: 'Tünd',
    cur: 'Valyuta', curNote: 'Yalnız göstərmək üçündür; məbləğlər çevrilmir.', login: 'Daxil ol', signup: 'Qeydiyyat', pw: 'Şifrə', signupOk: 'Qeydiyyat tamamdır. E-poçt təsdiqi aktivdirsə poçtunu yoxla.',
    confirm: 'Təsdiqlə', qty: 'Say', unit: 'Vahid qiymət', totalL: 'Cəmi', emoji: 'Emoji', newBtn: 'Yeni düymə', delQ: 'silinsin?', manual: 'Xərc', newLoan: 'Yeni kredit', defName: 'İstifadəçi' },
  ru: { hello: 'Привет', left: 'Остаток бюджета', spent: 'Потрачено', budget: 'Бюджет', quick: 'Быстрое добавление', new: '+ Новая', hint: 'Чтобы удалить, удерживай кнопку / нажми правой кнопкой.',
    home: 'Главная', exp: 'Расходы', loan: 'Кредиты', sum: 'Итоги', prof: 'Профиль', expT: 'Расходы', noExp: 'В этом месяце расходов нет.', addExp: '+ Добавить расход',
    name: 'Название', price: 'Цена', amount: 'Сумма', save: 'Сохранить', cancel: 'Отмена', loansT: 'Кредиты', monthly: 'В месяц', debt: 'Остаток долга', day: 'Каждый месяц, {d}-го числа',
    paidOf: 'Оплачено {a} из {b}', pay: 'Оплатил', done: '✅ Погашен', noLoan: 'Кредитов пока нет.', addLoan: '+ Добавить кредит', loanName: 'Название кредита', inst: 'Ежемесячный платёж',
    total: 'Всего платежей', payDay: 'День оплаты (1-31)', sumT: 'Итоги месяца', top: 'Больше всего потрачено', byCat: 'По категориям', noData: 'Нет данных.',
    profT: 'Профиль', email: 'Эл. почта', mBudget: 'Месячный бюджет', edit: 'Изменить', logout: 'Выйти', settings: 'Настройки', lang: 'Язык', theme: 'Тема', system: 'Системная', light: 'Светлая', dark: 'Тёмная',
    cur: 'Валюта', curNote: 'Только для отображения; суммы не конвертируются.', login: 'Войти', signup: 'Регистрация', pw: 'Пароль', signupOk: 'Регистрация завершена. Если включено подтверждение, проверь почту.',
    confirm: 'Подтвердить', qty: 'Количество', unit: 'Цена за штуку', totalL: 'Итого', emoji: 'Эмодзи', newBtn: 'Новая кнопка', delQ: 'удалить?', manual: 'Расход', newLoan: 'Новый кредит', defName: 'Пользователь' },
}
export default D
