const RegistrationStatus = {
  Registered: 262144,
  Fresh: 16,
  Repeat: 32,
  Improve: 64,
  Withdrawn: 1024,
  Excused: 2048,
  RegisterRequest: 1048576,
  AddRequest: 2097152,
  DropRequest: 4194304,
  WithdrawRequest: 8388608,
  ExcuseRequest: 16777216,
  Incomplete: 4294967296,
  Complete: 2147483648,
  Dropped: 549755813888,
  Absent: 536870912,
  Punished: 134217728,
  Audit: 32768,
  Banned : 2305843009213693952,
  ForcedWithdrawn: 17592186044416
}

const EmtyazRegistration = {
  RegisterRequest: 1,
  Registered: 2,
  Reject: 4,
}

const RegistrationRequestStatus = {
  STATUS_REGISTER_REQUEST: 1,
  STATUS_REGISTERED: 2,
  STATUS_WITHDRAW_REQUEST: 3,
  STATUS_DROP_REQUEST: 4,
  STATUS_WITHDRAWN: 5,
  STATUS_DROPPED: 6,
  STATUS_EXCUSED: 7,
  STATUS_INCOMPLETE: 8,
  STATUS_ADD_REQUEST: 9,
  STATUS_ABSENT: 10,
  STATUS_PUNISHED: 11,
  STATUS_AUDIT: 12,
  STATUS_BANNED: 13,
  STATUS_DEREGISTERED: 14
}

export {
  RegistrationStatus,
  RegistrationRequestStatus,
  EmtyazRegistration,
}
