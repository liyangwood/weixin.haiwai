
/*
 * Reusable schema
 */

IH.Schema.createdAt = new SimpleSchema({
  createdAt: {
    type: Date,
    optional: true,
    autoValue () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()}
      } else {
        this.unset();
      }
    }
  }
});

IH.Schema.updatedAt = new SimpleSchema({
  updatedAt: {
    type: Date,
    optional: true,
    autoValue () {
      if (this.isInsert) {
        this.unset();
      } else {
        return new Date();
      }
    }
  }
});

/**
 * Not is use but could be
 */
IH.Schema.Address = new SimpleSchema({
  street: {
    type: String,
    max: 100
  },
  city: {
    type: String,
    max: 50
  },
  state: {
    type: String,
    regEx: /^A[LKSZRAEP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]$/
  },
  zip: {
    type: String,
    regEx: /^[0-9]{5}$/
  }
});