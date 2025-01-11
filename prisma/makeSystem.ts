import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


async function main() {

    const newUser = await prisma.user.create({
        data: {
            username: "MeijiPay",
            email: "system@meijipay.jp",
        },
    });

    // Walletエントリを作成
    await prisma.wallet.create({
        data: {
            userId: newUser.id,
            balance: 100, // 初期残高を0に設定
        },
    });

}

main()
.then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });