module MyModule::TelemedicineBilling {

    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    /// Struct to store patient's billing info
    struct PatientBilling has store, key {
        total_paid: u64,
        consultation_fee: u64,
    }

    /// Initializes a patient's billing record with a consultation fee
    public fun init_patient_record(patient: &signer, fee: u64) {
        let billing = PatientBilling {
            total_paid: 0,
            consultation_fee: fee,
        };
        move_to(patient, billing);
    }

    /// Pays consultation fee to the healthcare provider
    public fun pay_consultation_fee(
        patient: &signer, 
        provider: address
    ) acquires PatientBilling {
        let billing = borrow_global_mut<PatientBilling>(signer::address_of(patient));
        let fee = billing.consultation_fee;

        let payment = coin::withdraw<AptosCoin>(patient, fee);
        coin::deposit<AptosCoin>(provider, payment);

        billing.total_paid = billing.total_paid + fee;
    }
}
