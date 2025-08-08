package com.lojacrysleao.lojacrysleao_api.service.storageService;


@Service
public class StorageService {

    @Autowired
    private StorageMapper storageMapper;

    @Autowired
    private StorageRepository storageRepository;

    public StorageDTO createStorage(StorageDTO dto) {
        if (dto == null) {
            throw new BadRequestException("O Produto não pode ser nulo");
        }

        Storage storage = storageMapper.toEntity(saved);
        storageRepository.save(storage);

        return storage;
    }

}