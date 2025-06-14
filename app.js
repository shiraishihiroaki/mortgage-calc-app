import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const app = createApp({
    setup() {
        const banks = ref([{
            name: '',
            fixedRate: true,
            rateType: '固定金利',
            over35YearsRate: 0,
            insuranceRate: 0,
            loanAmount: 0,
            loanTerm: 35,
            baseRate: 1.5,
            additionalRate: 0,
            monthlyPayment: 0,
            totalPayment: 0,
            totalInterest: 0
        }]);

        const addBank = () => {
            banks.value.push({
                name: '',
                fixedRate: true,
                rateType: '固定金利',
                over35YearsRate: 0,
                insuranceRate: 0,
                loanAmount: 0,
                loanTerm: 35,
                baseRate: 1.5,
                additionalRate: 0,
                monthlyPayment: 0,
                totalPayment: 0,
                totalInterest: 0
            });
        };

        const removeBank = (index) => {
            banks.value.splice(index, 1);
        };

        const calculateLoan = (bank) => {
            const totalRate = bank.baseRate + 
                Number(bank.over35YearsRate) + 
                Number(bank.insuranceRate);
            
            const monthlyRate = totalRate / 12 / 100;
            const numberOfPayments = bank.loanTerm * 12;
            
            // 月々の返済額の計算（元利均等返済方式）
            const monthlyPayment = bank.loanAmount * 10000 * 
                (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
            
            bank.monthlyPayment = Math.round(monthlyPayment);
            bank.totalPayment = Math.round(monthlyPayment * numberOfPayments);
            bank.totalInterest = Math.round(bank.totalPayment - (bank.loanAmount * 10000));
        };

        return {
            banks,
            addBank,
            removeBank,
            calculateLoan
        };
    },
    template: `
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-8">住宅ローンシミュレーター</h1>
            
            <div v-for="(bank, index) in banks" :key="index" class="card">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold text-gray-800">銀行 {{index + 1}}</h2>
                    <button @click="removeBank(index)" 
                            class="text-red-600 hover:text-red-800"
                            v-if="banks.length > 1">
                        削除
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="input-group">
                        <label class="input-label">銀行名</label>
                        <input type="text" v-model="bank.name" class="input-field" placeholder="○○銀行">
                    </div>

                    <div class="input-group">
                        <label class="input-label">金利タイプ</label>
                        <select v-model="bank.rateType" class="input-field">
                            <option>固定金利</option>
                            <option>変動金利</option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label class="input-label">基準金利 (%)</label>
                        <input type="number" v-model="bank.baseRate" step="0.01" class="input-field">
                    </div>

                    <div class="input-group">
                        <label class="input-label">35年以上金利上乗せ (%)</label>
                        <input type="number" v-model="bank.over35YearsRate" step="0.01" class="input-field" placeholder="例: 0.2">
                    </div>

                    <div class="input-group">
                        <label class="input-label">団信金利上乗せ (%)</label>
                        <input type="number" v-model="bank.insuranceRate" step="0.01" class="input-field" placeholder="例: 0.3">
                    </div>

                    <div class="input-group">
                        <label class="input-label">借入額 (万円)</label>
                        <input type="number" v-model="bank.loanAmount" class="input-field">
                    </div>

                    <div class="input-group">
                        <label class="input-label">返済期間 (年)</label>
                        <input type="number" v-model="bank.loanTerm" min="1" max="50" class="input-field">
                    </div>
                </div>

                <div class="mt-4">
                    <button @click="calculateLoan(bank)" class="btn">計算する</button>
                </div>

                <div v-if="bank.monthlyPayment > 0" class="mt-6">
                    <h3 class="text-lg font-semibold mb-3">計算結果</h3>
                    <table class="result-table">
                        <tr>
                            <th>借入総額</th>
                            <td>{{bank.loanAmount.toLocaleString()}}万円</td>
                        </tr>
                        <tr>
                            <th>返済総額</th>
                            <td>{{(bank.totalPayment / 10000).toLocaleString()}}万円</td>
                        </tr>
                        <tr>
                            <th>支払利息総額</th>
                            <td>{{(bank.totalInterest / 10000).toLocaleString()}}万円</td>
                        </tr>
                        <tr>
                            <th>月々の返済額</th>
                            <td>{{bank.monthlyPayment.toLocaleString()}}円</td>
                        </tr>
                        <tr>
                            <th>適用金利</th>
                            <td>{{(Number(bank.baseRate) + Number(bank.over35YearsRate) + Number(bank.insuranceRate)).toFixed(3)}}%</td>
                        </tr>
                    </table>
                </div>
            </div>

            <button @click="addBank" class="btn mt-4">
                銀行を追加
            </button>
        </div>
    `
});

app.mount('#app'); 