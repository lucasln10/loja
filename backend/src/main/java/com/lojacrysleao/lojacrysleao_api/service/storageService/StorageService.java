package com.lojacrysleao.lojacrysleao_api.service.storageService;


@Service
public class StorageService {

    @Autowired
    private StorageRepository storageRepository;

    @Autowired
    private StorageMapper  storageMapper;

    public StorageDTO createStorage(Product product) {
        if (product == null) {
            throw new BadRequestException("O Produto não pode ser nulo");
        }

        Storage storage = storageMapper.toEntity(product); //PRODUTO
        storageRepository.save(storage); //SALVA STORAGE COM ID DO PRODUTO NA TABELA

        return storage;
    }

}